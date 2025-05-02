const mongoose = require('mongoose');

// Main user schema - arbitrary
const userSchema = new mongoose.Schema({
  // Shown in the user page and comments; changeable by the user.
  name: {
    type: String,
    required: true
  },
  // Hashed string representing the password.
  password: {
    type: String,
    required: true
  },
  // Used for password reset.
  email: {
    type: String,
    required: true
  },
  user_subscription: {
    type: String
  },
  // Indicates whether the user is an admin.
  is_admin: {
    type: Boolean,
    default: false
  },
  // New field for storing the password reset code
  resetCode: {
    type: String
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);