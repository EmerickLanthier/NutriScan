const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', authController.updateProfile);

router.post('/forgotPassword', authController.forgotPassword);

module.exports = router;