const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'ENGGKK 🙅🏻 Username and password are required.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'ENGGKK 🙅🏻 Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'ENGGKK 🙅🏻 Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'Login successfully 🚀✨',
      token,
      user: {
        id:       user.id,
        username: user.username,
        role:     user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully 🚀✨' });
};

module.exports = { login, logout };