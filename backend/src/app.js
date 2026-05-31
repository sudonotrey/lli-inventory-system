const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const authRoutes   = require('./routes/auth.routes');
const categoryRoutes  = require('./routes/category.routes');
const supplierRoutes  = require('./routes/supplier.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers',  supplierRoutes);


// Check API
app.get('/', (req, res) => {
  res.json({ success: true, message: 'LLI API is running 🚀✨' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🕷️`);
});