import db  from "../clients/db.mysql.js";

export const createDefaultCategories = async (userId) => {
  const categories = ["Food", "Transportation", "Entertainment", "Bills", "Other"];
  const values = categories.map(name => [userId, name]);
  await db.query(
    "INSERT INTO categories (user_id, name) VALUES ?",
    [values]
  );
};

export const getUserCategories = async (userId) => {
  const [rows] = await db.query(
    "SELECT id, name, color FROM categories WHERE user_id = ? ORDER BY name",
    [userId]
  );
  return rows;
};

export const findByName = async (userId, name) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE user_id = ? AND name = ?",
    [userId, name]
  );
  return rows[0];
};


export const createCategory = async (userId, name, color) => {

  const [result] = await db.query(
    "INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)",
    [userId, name, color || null]
  );
  return result.insertId;
};


// export const createCategory = async (userId, name, color) => {
//   const [result] = await db.query(
//     "INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)",
//     [userId, name, color || null]
//   );
//   return result.insertId;
// };


