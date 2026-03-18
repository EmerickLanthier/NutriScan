const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/scan', productController.handleScan);

router.get('/history', productController.getHistory);

router.delete('/history/:id', productController.deleteFromHistory);

router.get('/details/:barcode', productController.getProductByBarcode);

router.post('/update', productController.updateHistory)

module.exports = router;