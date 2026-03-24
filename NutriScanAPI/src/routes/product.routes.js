const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.post('/scan', auth, productController.handleScan);

router.get('/history', auth, productController.getHistory);

router.delete('/history/:id', auth, productController.deleteFromHistory);

router.get('/details/:barcode', auth, productController.getProductByBarcode);

router.post('/update', auth, productController.updateHistory)

router.post('/history/:id/favorite', auth, productController.toggleFavorite);

module.exports = router;