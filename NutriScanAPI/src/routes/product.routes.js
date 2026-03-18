const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/scan', productController.handleScan);

router.get('/history', productController.getHistory);

module.exports = router;