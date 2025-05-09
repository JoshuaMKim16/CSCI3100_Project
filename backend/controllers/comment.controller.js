const Comment = require('../models/comment.model');

// Create a new comment (or nested comment) associated with a location
const createComment = async (req, res) => {
  try {
    const { content, author, location, parentComment } = req.body;
    const comment = await Comment.create({
      content,
      author,
      location,
      parentComment: parentComment || null,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments in the database
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'name')
      .populate('location', 'name')
      .populate('parentComment');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a specific location
const getCommentsByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const comments = await Comment.find({ location: locationId })
      .populate('author', 'name')
      .populate('parentComment');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments made by a specific user
const getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const comments = await Comment.find({ author: userId })
      .populate('location', 'name')
      .populate('author', 'name');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a comment 
const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike a comment 
const dislikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getAllComments,   
  getCommentsByLocation,
  getCommentsByUser,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment
};