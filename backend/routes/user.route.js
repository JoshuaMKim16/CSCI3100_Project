const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { signupUser } = require('../controllers/auth.controller'); 

// browse list of users
router.get('/', authenticateToken, getUsers);

// search a user with id
router.get("/:id", authenticateToken, getUser);

// create a user using the signupUser function
router.post("/", signupUser);

// update a user 
router.put("/:id", authenticateToken, updateUser);

// delete a user 
router.delete("/:id", authenticateToken, deleteUser);

module.exports = router;