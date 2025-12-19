import db from "../clients/db.mysql.js";

export const createExpense = async ({ user_id, title, amount, category_id, date, description }) => {
  console.log(4444)
  const [result] = await db.query(
    "INSERT INTO expenses (user_id, category_id, title, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)",
    [user_id, category_id, title, amount, date, description || null]
  );
  return result.insertId;
};

export const getExpenses = async (user_id, filters = {}) => {
  let query = `
    SELECT e.id, e.title, e.amount, c.name AS category, e.date, e.description, e.created_at
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
    WHERE e.user_id = ?
  `;
  const values = [user_id];

  if (filters.category) {
    query += " AND c.name = ?";
    values.push(filters.category);
  }
  if (filters.start_date) {
    query += " AND e.date >= ?";
    values.push(filters.start_date);
  }
  if (filters.end_date) {
    query += " AND e.date <= ?";
    values.push(filters.end_date);
  }

  query += " ORDER BY e.date DESC";

  const [rows] = await db.query(query, values);
  return rows;
};

export const getExpenseById = async (expenseId) => {
  const [rows] = await db.query(
    `SELECT e.id, e.user_id, e.title, e.amount, c.name AS category, e.date, e.description, e.created_at
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     WHERE e.id = ?`,
    [expenseId]
  );
  return rows[0];
};

export const updateExpense = async (expenseId, fields) => {
  const setClause = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  values.push(expenseId);

  await db.query(`UPDATE expenses SET ${setClause} WHERE id = ?`, values);
};

