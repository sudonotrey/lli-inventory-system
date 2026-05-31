const { sql, poolPromise } = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Units ORDER BY name');
    res.json({ success: true, data: result.recordset });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Units WHERE id = @id');
    if (!result.recordset[0]) {
      return res.status(404).json({ success: false, message: 'ENKKK 🙅🏻 Unit not found.' });
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  const { name, abbreviation } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'ENGGKK 🙅 Unit name is required.' });
  }
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name',         sql.NVarChar, name)
      .input('abbreviation', sql.NVarChar, abbreviation || null)
      .query('INSERT INTO Units (name, abbreviation) VALUES (@name, @abbreviation)');
    res.status(201).json({ success: true, message: 'Unit created successfully 🚀✨' });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  const { name, abbreviation } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'ENGGKK 🙅 Unit name is required.' });
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id',           sql.Int,      req.params.id)
      .input('name',         sql.NVarChar, name)
      .input('abbreviation', sql.NVarChar, abbreviation || null)
      .query('UPDATE Units SET name=@name, abbreviation=@abbreviation WHERE id=@id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'ENKKK 🙅🏻 Unit not found.' });
    }
    res.json({ success: true, message: 'Unit updated successfully 🚀✨' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Units WHERE id=@id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'ENKKK 🙅🏻 Unit not found.' });
    }
    res.json({ success: true, message: 'Unit deleted successfully 🚀✨' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };