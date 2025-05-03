// routes/comment.route.js
const express = require("express");
const router = express.Router();
const { 
  createComment, 
  getAllComments,       // Import new function
  getCommentsByLocation, 
  getCommentsByUser, 
  updateComment, 
  deleteComment,
  likeComment,
  dislikeComment 
} = require('../controllers/comment.controller');

// Create a comment (or nested comment)
router.post("/", createComment);

// Retrieve all comments in the database
router.get("/", getAllComments);

// Retrieve comments for a specific location
router.get("/location/:locationId", getCommentsByLocation);

// Retrieve comments made by a specific user
router.get("/user/:userId", getCommentsByUser);

// Update a comment
router.put("/:id", updateComment);

// Delete a comment
router.delete("/:id", deleteComment);

// Like a comment
router.post("/:id/like", likeComment);

// Dislike a comment
router.post("/:id/dislike", dislikeComment);

module.exports = router;