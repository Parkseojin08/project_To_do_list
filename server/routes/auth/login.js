const express = require('express');
const router = express.Router();
const authController = require('../../controller/authController');

// POST /auth/login
router.post('/', authController.login);

module.exports = router;