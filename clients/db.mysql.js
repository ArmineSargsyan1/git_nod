import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";

const {
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_PORT
} = process.env;

const caFilePath = path.resolve("./clients/certificates/ca.pem");

const ca = await fs.readFile(caFilePath, "utf8");

const connection = await mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: Number(MYSQL_PORT),

  waitForConnections: true,

  ssl: {
    ca: ca,
    rejectUnauthorized: true
  }
});



export default connection;
