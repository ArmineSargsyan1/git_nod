import db from "../clients/db.mysql.js";
import {buildExpenseFilters} from "../helpers/utils.js";

export const createExpense = async ({
                                      user_id,
                                      title,
                                      amount,
                                      category,
                                      date,
                                      description
                                    }) => {
  const [result] = await db.query(
    `INSERT INTO expenses 
     (user_id, title, amount, category, date, description) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      title,
      amount,
      category,
      date,
      description || null
    ]
  );

  return result.insertId;
};



export const getExpenses = async (user_id, filters = {}) => {
  let query = `
    SELECT 
      id,
      title,
      amount,
      category,
      date,
      description,
      created_at
    FROM expenses
    WHERE user_id = ?
  `;

  const { filterSql, values: filterValues } = buildExpenseFilters(filters);

  const values = [user_id, ...filterValues];

  query += filterSql;
  query += " ORDER BY date DESC";

  const [rows] = await db.query(query, values);
  return rows;
};


export const getExpenseById = async (expenseId) => {
  const [rows] = await db.query(
    `SELECT 
        id,
        user_id,
        title,
        amount,
        category,
        date,
        description,
        created_at
     FROM expenses
     WHERE id = ?`,
    [expenseId]
  );

  return rows[0];
};


export const updateExpense = async (expenseId, fields) => {
  const setClause = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fields), expenseId];

  await db.query(`UPDATE expenses SET ${setClause} WHERE id = ?`, values);
};


export const deleteExpense = async (expenseId) => {
  const [result] = await db.query(
    `DELETE FROM expenses WHERE id = ?`,
    [expenseId]
  );

  return result.affectedRows > 0;
};
