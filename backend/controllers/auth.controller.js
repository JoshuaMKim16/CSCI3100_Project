const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Controller function for user signup
const signupUser = async (req, res) => {
    try {
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hashedPassword;
        const user = await User.create(req.body);
        res.status(200).json({ status: true, message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Controller function for user login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if a user with the given username exists
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(401).json({ status: false, message: "User not found" });
        }
        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return res.status(200).json({ status: true, message: "Login successful", user });
        } else {
            return res.status(401).json({ status: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { signupUser, loginUser };