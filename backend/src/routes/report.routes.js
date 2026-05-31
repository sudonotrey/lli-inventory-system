const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { inventorySummary, lowStock, expiryReport } = require('../controllers/report.controller');

router.get('/inventory-summary', auth, inventorySummary);
router.get('/low-stock',         auth, lowStock);
router.get('/expiry',            auth, expiryReport);

module.exports = router;