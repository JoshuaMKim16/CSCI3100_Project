const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Hashed password
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  user_subscription: {
    type: String
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  resetCode: {
    type: String
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);