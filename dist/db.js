"use strict";
// const { Pool } = require('pg');
// import dotenv from 'dotenv';
// dotenv.config();
// const connectDb = async () => {
//   try {
//     const pool = new Pool({
//       user: process.env.PGUSER,
//       host: process.env.PGHOST,
//       database: process.env.PGDATABASE,
//       password: process.env.PGPASSWORD,
//       port: process.env.PGPORT,
//     });
//     await pool.connect();
//     const res = await pool.query('SELECT * FROM journal_entry');
//     // console.log(res);
//     // console.log(res.rows);
//     const rows = res.rows;
//     rows[0].full_name;
//     rows[0].title;
//     rows[0].journal_entry;
//     console.log(rows[0].full_name, rows[0].title, rows[0].journal_entry);
//     await pool.end();
//   } catch (error) {
//     console.log(error);
//   }
// };
// connectDb();
