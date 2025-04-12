const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  // Reference to the user who made the comment
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Reference to the associated tour site from the location model (Site) - to be under the category of each location/site
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location', // Updated reference to match the model exported from location.model.js
    required: true
  },

  // For nested/threaded comments (optional)
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  // Like and dislike counters
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);