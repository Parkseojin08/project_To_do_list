const express = require('express');
const router = express.Router();
const authController = require('../../controller/authController.js');

router.get('/', authController.emailcheck)

module.exports = router
