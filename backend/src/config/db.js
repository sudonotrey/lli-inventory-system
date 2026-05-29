const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Successfully connected to MSSQL');
    return pool;
  })
  .catch((err) => {
    console.error('Database Connection Error:', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };