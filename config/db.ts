// /lib/mysqlConnection.ts

import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST,      // e.g., 'localhost'
  user: process.env.DB_USER,      // e.g., 'root'
  password: process.env.DB_PASS,  // e.g., 'password'
  database: process.env.DB_NAME,  // e.g., 'mydatabase'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



export default connection;
