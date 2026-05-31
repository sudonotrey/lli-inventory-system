const { sql, poolPromise } = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Suppliers ORDER BY name');
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Suppliers WHERE id = @id');
    if (!result.recordset[0]) {
      return res.status(404).json({ success: false, message: 'ENKKK 🙅🏻 Supplier not found.' });
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  const { name, contact_name, phone, email, address } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'ENGGKK 🙅 Supplier name is required.' });
  }
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name',         sql.NVarChar, name)
      .input('contact_name', sql.NVarChar, contact_name || null)
      .input('phone',        sql.NVarChar, phone        || null)
      .input('email',        sql.NVarChar, email        || null)
      .input('address',      sql.NVarChar, address      || null)
      .query(`
        INSERT INTO Suppliers (name, contact_name, phone, email, address)
        VALUES (@name, @contact_name, @phone, @email, @address)
      `);
    res.status(201).json({ success: true, message: 'Supplier created successfully 🚀✨' });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  const { name, contact_name, phone, email, address } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'ENGGKK 🙅 Supplier name is required.' });
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id',           sql.Int,      req.params.id)
      .input('name',         sql.NVarChar, name)
      .input('contact_name', sql.NVarChar, contact_name || null)
      .input('phone',        sql.NVarChar, phone        || null)
      .input('email',        sql.NVarChar, email        || null)
      .input('address',      sql.NVarChar, address      || null)
      .query(`
        UPDATE Suppliers
        SET name=@name, contact_name=@contact_name,
            phone=@phone, email=@email, address=@address
        WHERE id=@id
      `);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found.' });
    }
    res.json({ success: true, message: 'Supplier updated successfully 🚀✨' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Suppliers WHERE id=@id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'ENKKK 🙅🏻 Supplier not found.' });
    }
    res.json({ success: true, message: 'Supplier deleted successfully 🚀✨' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };