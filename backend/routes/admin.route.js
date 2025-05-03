const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const { adminCheck } = require('../middlewares/admin.middleware');
const { getUsers, updateUser, deleteUser } = require('../controllers/user.controller');

// Apply authentication and admin check to all routes defined below.
router.use(authenticateToken, adminCheck);

// Admin-specific endpoint to get list of all users
router.get('/users', getUsers);

// Admin-specific endpoint to update a user by ID
router.put('/users/:id', updateUser);

// Admin-specific endpoint to delete a user by ID
router.delete('/users/:id', deleteUser);

module.exports = router;