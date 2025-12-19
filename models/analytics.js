import db from '../clients/db.mysql.js';

export const getTotalSpending = async (user_id, start_date, end_date) => {
  let query = `SELECT SUM(amount) AS total_spending FROM expenses WHERE user_id = ?`;
  let values = [user_id];

  if (start_date) {
    query += ` AND date >= ?`;
    values = [...values, start_date];
  }

  if (end_date) {
    query += ` AND date <= ?`;
    values = [...values, end_date];
  }

  const [rows] = await db.query(query, values);
  return rows[0].total_spending || 0;
};


export const getSpendingByCategory = async (user_id, start_date, end_date) => {
  let query = `
    SELECT 
      category,
      COUNT(*) AS expense_count,
      SUM(amount) AS total_amount,
      AVG(amount) AS average_amount
    FROM expenses
    WHERE user_id = ?
  `;
  const values = [user_id];

  if (start_date) {
    query += ` AND date >= ?`;
    values.push(start_date);
  }
  if (end_date) {
    query += ` AND date <= ?`;
    values.push(end_date);
  }

  query += ` GROUP BY category ORDER BY total_amount DESC`;

  const [rows] = await db.query(query, values);
  return rows;
};


export const getMonthlySummary = async (user_id, year) => {
  const selectedYear = year || new Date().getFullYear();

  const query = `
    SELECT 
      MONTH(date) AS month,
      COUNT(*) AS expense_count,
      IFNULL(SUM(amount), 0) AS total_amount,
      IFNULL(AVG(amount), 0) AS average_amount
    FROM expenses
    WHERE user_id = ? AND YEAR(date) = ?
    GROUP BY YEAR(date), MONTH(date)
    ORDER BY month
  `;

  const [rows] = await db.query(query, [user_id, selectedYear]);
  return { year: selectedYear, monthly_summary: rows };
};
