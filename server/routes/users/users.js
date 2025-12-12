const express = require('express');
const router = express.Router();
const usersController = require('../../controller/usersController');

router.get('/', usersController.profile)

module.exports = router;
