const { sql, poolPromise } = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT
        p.*,
        c.name  AS category_name,
        s.name  AS supplier_name,
        u.name  AS unit_name,
        u.abbreviation AS unit_abbreviation
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      LEFT JOIN Suppliers  s ON p.supplier_id = s.id
      LEFT JOIN Units      u ON p.unit_id     = u.id
      ORDER BY p.name
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT
          p.*,
          c.name  AS category_name,
          s.name  AS supplier_name,
          u.name  AS unit_name,
          u.abbreviation AS unit_abbreviation
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN Suppliers  s ON p.supplier_id = s.id
        LEFT JOIN Units      u ON p.unit_id     = u.id
        WHERE p.id = @id
      `);
    if (!result.recordset[0]) {
      return res.status(404).json({ success: false, message: 'ENKKK 🙅🏻 Product not found.' });
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  const {
    name, generic_name, sku, batch_number,
    category_id, supplier_id, unit_id,
    manufacturer, quantity, reorder_level,
    unit_price, expiry_date,
  } = req.body;

  if (!name || !sku) {
    return res.status(400).json({ success: false, message: 'ENGGKK 🙅 Product name and SKU are required.' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name',          sql.NVarChar,    name)
      .input('generic_name',  sql.NVarChar,    generic_name  || null)
      .input('sku',           sql.NVarChar,    sku)
      .input('batch_number',  sql.NVarChar,    batch_number  || null)
      .input('category_id',   sql.Int,         category_id   || null)
      .input('supplier_id',   sql.Int,         supplier_id   || null)
      .input('unit_id',       sql.Int,         unit_id       || null)
      .input('manufacturer',  sql.NVarChar,    manufacturer  || null)
      .input('quantity',      sql.Int,         quantity      || 0)
      .input('reorder_level', sql.Int,         reorder_level || 0)
      .input('unit_price',    sql.Decimal(10,2), unit_price  || 0.00)
      .input('expiry_date',   sql.Date,        expiry_date   || null)
      .query(`
        INSERT INTO Products (
          name, generic_name, sku, batch_number,
          category_id, supplier_id, unit_id,
          manufacturer, quantity, reorder_level,
          unit_price, expiry_date
        ) VALUES (
          @name, @generic_name, @sku, @batch_number,
          @category_id, @supplier_id, @unit_id,
          @manufacturer, @quantity, @reorder_level,
          @unit_price, @expiry_date
        )
      `);
    res.status(201).json({ success: true, message: 'Product created successfully 🚀✨' });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  const {
    name, generic_name, sku, batch_number,
    category_id, supplier_id, unit_id,
    manufacturer, quantity, reorder_level,
    unit_price, expiry_date,
  } = req.body;

  if (!name || !sku) {
    return res.status(400).json({ success: false, message: 'ENGGKK 🙅 Product name and SKU are required.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id',            sql.Int,         req.params.id)
      .input('name',          sql.NVarChar,    name)
      .input('generic_name',  sql.NVarChar,    generic_name  || null)
      .input('sku',           sql.NVarChar,    sku)
      .input('batch_number',  sql.NVarChar,    batch_number  || null)
      .input('category_id',   sql.Int,         category_id   || null)
      .input('supplier_id',   sql.Int,         supplier_id   || null)
      .input('unit_id',       sql.Int,         unit_id       || null)
      .input('manufacturer',  sql.NVarChar,    manufacturer  || null)
      .input('quantity',      sql.Int,         quantity      || 0)
      .input('reorder_level', sql.Int,         reorder_level || 0)
      .input('unit_price',    sql.Decimal(10,2), unit_price  || 0.00)
      .input('expiry_date',   sql.Date,        expiry_date   || null)
      .query(`
        UPDATE Products SET
          name=@name, generic_name=@generic_name,
          sku=@sku, batch_number=@batch_number,
          category_id=@category_id, supplier_id=@supplier_id,
          unit_id=@unit_id, manufacturer=@manufacturer,
          quantity=@quantity, reorder_level=@reorder_level,
          unit_price=@unit_price, expiry_date=@expiry_date,
          updated_at=GETDATE()
        WHERE id=@id
      `);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'ENKKK 🙅🏻 Product not found.' });
    }
    res.json({ success: true, message: 'Product updated successfully 🚀✨' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Products WHERE id=@id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'ENKKK 🙅🏻 Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted successfully 🚀✨' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };