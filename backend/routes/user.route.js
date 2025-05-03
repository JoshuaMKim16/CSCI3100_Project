const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { signupUser } = require('../controllers/auth.controller'); 

// browse list of users (protected)
router.get('/', authenticateToken, getUsers);

// search a user with id (protected)
router.get("/:id", authenticateToken, getUser);

// create a user using the signupUser function (signup endpoint can remain unprotected if needed)
router.post("/", signupUser);

// update a user (protected)
router.put("/:id", authenticateToken, updateUser);

// delete a user (protected)
router.delete("/:id", authenticateToken, deleteUser);

module.exports = router;