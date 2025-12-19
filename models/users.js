import HttpErrors from "http-errors";
import dbConnection from "../clients/db.mysql.js";
import {hashPassword} from "../services/utils.js";


const { USER_SECRET } = process.env;



export const createUser = async ({ id, username, email, password }) => {
  console.log(" existing user...");

  const [existingUsers] = await dbConnection.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {

    throw HttpErrors(404, "User already exists!");
  }

  const hashedPassword = await hashPassword(password);

  await dbConnection.execute(
    'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
    [id, username, email, hashedPassword]
  );

  return { id, username, email };
};



export const findUserByEmail = async (email) => {
  const [rows] = await dbConnection.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
};


export const findUserByID = async (id) => {
  const [rows] = await dbConnection.execute(
    `SELECT *
     FROM users
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
};




