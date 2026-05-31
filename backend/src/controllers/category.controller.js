const { sql, poolPromise } = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Categories ORDER BY name');
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Categories WHERE id = @id');
    if (!result.recordset[0]) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name',        sql.NVarChar, name)
      .input('description', sql.NVarChar, description || null)
      .query('INSERT INTO Categories (name, description) VALUES (@name, @description)');
    res.status(201).json({ success: true, message: 'Category created successfully.' });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id',          sql.Int,      req.params.id)
      .input('name',        sql.NVarChar, name)
      .input('description', sql.NVarChar, description || null)
      .query('UPDATE Categories SET name=@name, description=@description WHERE id=@id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category updated successfully.' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Categories WHERE id=@id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };