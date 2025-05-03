const express = require("express");
const router = express.Router();

// Import signupUser from auth.controller.js instead of using createUser from user.controller.js
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { signupUser } = require('../controllers/auth.controller'); 

// browse list of users
router.get('/', getUsers);

// search a user with id
router.get("/:id", getUser);

// create a user using the signupUser function (which handles password hashing)
router.post("/", signupUser);

// update a user
router.put("/:id", updateUser);

// delete a user
router.delete("/:id", deleteUser);

module.exports = router;