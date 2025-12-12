const express = require('express');
const router = express.Router();
const authController = require('../../controller/authController.js');

router.post('/',authController.register);

module.exports = router;