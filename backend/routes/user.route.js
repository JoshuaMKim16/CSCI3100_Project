const express = require("express")
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller')

// browse list of users
router.get('/', getUsers);

// search a user with id
router.get("/:id", getUser)

// create a user
router.post("/", createUser);

// update a user
router.put("/:id", updateUser);

// delete a user
router.delete("/:id", deleteUser);

module.exports = router;
