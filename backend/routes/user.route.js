import express from 'express';
import bcryp from 'bcrypt';
import {User} from '../modeks/User.model.js';

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

router.post('/signup', (req, res) => {
    const {username, email, password} = req.body;
    const User.find({email})
    if(user) {
        return res.json({message: "User already existed"})
    }
    const hashpassword = await bcryt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        passsword: hashpassword,
    })

    await newUser.save()
    return res.json({message: "record registered"})
})

module.exports = router;
