const result = require('dotenv').config({ path: '.env' });
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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
        const { email, password } = req.body;
        // Check if a user with the given username exists
        const user = await User.findOne({ email: email });
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

// Configure Nodemailer transporter
// Replace these values with your SMTP settings or use environment variables.

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
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        
        // Generate a 6-digit reset code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = code;
        await user.save();

        // Email options
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

// Controller function for resetting the user's password after verifying the code
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user || user.resetCode !== code) {
            return res.status(400).json({ status: false, message: "Invalid verification code or email." });
        }
        
        // Encrypt and update the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetCode = undefined;  // Clear the reset code
        await user.save();

        return res.status(200).json({ status: true, message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { signupUser, loginUser, forgotPassword, resetPassword };