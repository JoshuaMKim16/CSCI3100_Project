const dotenv = require('dotenv');
dotenv.config();

const result = require('dotenv').config({ path: '.env' });
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); 

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET; 

// Controller function for user signup
const signupUser = async (req, res) => {
    try {
        // Normalize the email to avoid case-sensitivity issues
        req.body.email = req.body.email.toLowerCase();

        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ status: false, message: "Email already exists." });
        }

        // Check if an admin code is provided and valid (ADMIN CODE = "admin")
        if (req.body.adminCode && req.body.adminCode === "admin") {
            req.body.is_admin = true;
        } else {
            req.body.is_admin = false;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hashedPassword;
        
        // Create the user
        const user = await User.create(req.body);
        
        // Generate JWT after signup 
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '720h' });
      
        res.status(200).json({ status: true, message: "User created successfully", user, token });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: false, message: "Email already exists." });
        }
        res.status(500).json({ status: false, message: error.message });
    }
};

// Controller function for user login with JWT token generation
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ status: false, message: "User not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '720h' });
            return res.status(200).json({ status: true, message: "Login successful", user, token });
        } else {
            return res.status(401).json({ status: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "csci3100e1@gmail.com",
      pass: `${process.env.APP_PASSWORD}`,
    },
});

// Controller function for sending a password reset code to the user's email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        
        // Generate a 6-digit reset code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = code;
        await user.save();

        // Email formatting
        const mailOptions = {
            from: '"No Reply" <noreply@example.com>',
            to: user.email,
            subject: "Password Reset Verification Code",
            text: `Your password reset verification code is: ${code}`,
        };

        // Send email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(500).json({ status: false, message: "Error sending email." });
            }
            console.log("Email sent:", info.response);
            return res.status(200).json({ status: true, message: "A verification code has been sent to your email." });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Controller function for resetting the user's password after code verification
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetCode !== code) {
            return res.status(400).json({ status: false, message: "Invalid verification code or email." });
        }
        
        // Encrypt and update new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetCode = undefined; 
        await user.save();

        return res.status(200).json({ status: true, message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { signupUser, loginUser, forgotPassword, resetPassword };