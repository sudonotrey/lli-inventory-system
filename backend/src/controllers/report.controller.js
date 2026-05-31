const { sql, poolPromise } = require('../config/db');

// Report 1: Inventory Summary by Category
const inventorySummary = async (req, res, next) => {
  try {
    const pool = await poolPromise;

    const summary = await pool.request().query(`
      SELECT
        ISNULL(c.name, 'Uncategorized') AS category,
        COUNT(p.id)                      AS total_products,
        SUM(p.quantity)                  AS total_quantity,
        SUM(p.quantity * p.unit_price)   AS total_value
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      GROUP BY c.name
      ORDER BY total_value DESC
    `);

    const totals = await pool.request().query(`
      SELECT
        COUNT(*)                         AS total_products,
        SUM(quantity)                    AS total_quantity,
        SUM(quantity * unit_price)       AS total_value
      FROM Products
    `);

    res.json({
      success: true,
      data: {
        summary: summary.recordset,
        totals:  totals.recordset[0],
      },
    });
  } catch (err) { next(err); }
};


module.exports = { inventorySummary, lowStock, expiryReport };