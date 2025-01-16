const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');
const router = express.Router();


// TODO: Use openapi for documentation
router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;
