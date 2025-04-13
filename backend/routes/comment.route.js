const express = require("express");
const router = express.Router();
const { 
  createComment, 
  getCommentsByLocation, 
  updateComment, 
  deleteComment,
  likeComment,
  dislikeComment 
} = require('../controllers/comment.controller');

// Create a comment (or nested comment)
router.post("/", createComment);

// Retrieve comments for a specific location
router.get("/location/:locationId", getCommentsByLocation);

// Update a comment
router.put("/:id", updateComment);

// Delete a comment
router.delete("/:id", deleteComment);

// Like a comment
router.post("/:id/like", likeComment);

// Dislike a comment
router.post("/:id/dislike", dislikeComment);

module.exports = router;