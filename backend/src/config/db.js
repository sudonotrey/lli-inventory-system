const sql = require('mssql');
require('dotenv').config();

const config = {
  server: 'DESKTOP-KF1772L',
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    instanceName: 'SQLEXPRESS',
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('✅ Connected to MSSQL');
    return pool;
  })
  .catch((err) => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };