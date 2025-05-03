import React, { useState, useEffect } from 'react';
import {Container} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const CommentsSection = ({ locationId }) => {
  // Retrieve logged-in user info (adjust this logic to match your auth implementation)
  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const userId = loggedInUser._id;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    content: '',
    // use logged in user's _id for the author field
    author: userId,
    location: locationId,
  });
  const [error, setError] = useState('');

  // State for editing: holds the id of the comment being edited and its new content
  const [editingComment, setEditingComment] = useState({
    id: null,
    content: ''
  });

  // State for ... list in owner's comment
  const [showActions, setShowActions] = useState(false);

  // Fetch comments for the given location ID
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/comments/location/${locationId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Could not load comments.');
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchComments();
    }
  }, [locationId]);

  // Handle change in the new comment form
  const handleNewCommentChange = (e) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a new comment
  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const savedComment = await response.json();
      setComments([...comments, savedComment]);
      // Reset only the content field after submission
      setNewComment((prev) => ({ ...prev, content: '' }));
      setError('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Could not post comment.');
    }
  };

  // Delete a comment
  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      // Remove the deleted comment from local state
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Could not delete comment.');
    }
  };

  // Start editing: set the comment id and prefill content
  const startEditing = (comment) => {
    // Allow editing only if the logged in user is the author
    if (!isCommentOwner(comment)) {
      alert("You can only edit your own comments.");
      return;
    }
    setEditingComment({ id: comment._id, content: comment.content });
  };

  // Handle editing content change
  const handleEditingChange = (e) => {
    setEditingComment({ ...editingComment, content: e.target.value });
  };

  // Submit the edit
  const submitEdit = async (e) => {
    e.preventDefault();
    const { id, content } = editingComment;
    try {
      const response = await fetch(`http://localhost:3000/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const updatedComment = await response.json();
      // Update the comment in local state but preserve original author
      const originalComment = comments.find(comment => comment._id === id);
      const preservedComment = { ...updatedComment, author: originalComment.author };
      setComments(comments.map(comment => comment._id === id ? preservedComment : comment));
      // Reset editing state
      setEditingComment({ id: null, content: '' });
    } catch (err) {
      console.error('Error editing comment:', err);
      setError('Could not edit comment.');
    }
  };

  // Like a comment
  const handleLike = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/comments/${commentId}/like`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const updatedComment = await response.json();
      // Preserve the original author info
      const originalComment = comments.find(comment => comment._id === commentId);
      const preservedComment = { ...updatedComment, author: originalComment.author };
      setComments(comments.map(comment => comment._id === commentId ? preservedComment : comment));
    } catch (err) {
      console.error('Error liking comment:', err);
      setError('Could not like comment.');
    }
  };

  // Dislike a comment
  const handleDislike = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/comments/${commentId}/dislike`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const updatedComment = await response.json();
      // Preserve the original author info
      const originalComment = comments.find(comment => comment._id === commentId);
      const preservedComment = { ...updatedComment, author: originalComment.author };
      setComments(comments.map(comment => comment._id === commentId ? preservedComment : comment));
    } catch (err) {
      console.error('Error disliking comment:', err);
      setError('Could not dislike comment.');
    }
  };

  // Utility function to check if the logged-in user is the author of a comment
  const isCommentOwner = (comment) => {
    if (typeof comment.author === 'object' && comment.author !== null) {
      return comment.author._id === userId;
    }
    return comment.author === userId;
  };

  return (
    <Container style={{border: '1px solid', borderRadius: '5px', marginTop: '2rem', padding: '10px'}}>
    <div className="comments-section">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Comments</h3>
      <form onSubmit={handleNewCommentSubmit} style={{ marginTop: '1rem' }}>
        <textarea
          name="content"
          value={newComment.content}
          onChange={handleNewCommentChange}
          placeholder="Write your comment here..."
          required
          style={{ width: '100%', height: '100px', padding: '0.5rem', boxSizing: 'border-box' }}
        />
        {/* The author input is hidden since logged in user info is used */}
        <button type="submit" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          Add Comment
        </button>
      </form>
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="comment"
              style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #eee' }}
            >
              <p>
                <strong>
                  {typeof comment.author === 'object' && comment.author !== null
                    ? comment.author.name
                    : (comment.author === userId ? loggedInUser.name : 'User')}
                </strong>
              </p>
              {editingComment.id === comment._id ? (
                <form onSubmit={submitEdit}>
                  <textarea
                    value={editingComment.content}
                    onChange={handleEditingChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', boxSizing: 'border-box' }}
                  />
                  <button type="submit" style={{marginBottom: '0.5rem'}}>Save</button>
                  <button type="button" onClick={() => setEditingComment({ id: null, content: '' })}>
                    Cancel
                  </button>
                </form>
              ) : (
                <p>{comment.content}</p>
              )}
              <div style={{ marginTop: '0.5rem' }}>
                <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleLike(comment._id)} style={{color: 'green', cursor: 'pointer'}}/> {comment.likes || 0}
                <FontAwesomeIcon icon={faThumbsDown} onClick={() => handleDislike(comment._id)} style={{color: 'red', cursor: 'pointer', marginLeft: '30px'}}/> {comment.dislikes || 0}
                {isCommentOwner(comment) && (
                  <div style={{ position:'relative', left: '95%'}}>
                      <FontAwesomeIcon icon={faEllipsisV} onClick={() => setShowActions(!showActions)} style={{ cursor: 'pointer', marginLeft: '10px' }}/>
                      {showActions && (
                          <div style={{
                              position: 'relative',
                              backgroundColor: '#fff',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              padding: '5px',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              width: '100px'
                          }}>
                              <button
                                  onClick={() => {
                                      startEditing(comment);
                                      setShowActions(false);
                                  }}
                                  style={{ marginBottom: '0.5rem'}}
                              >
                                  Edit
                              </button>
                              <button
                                  onClick={() => {
                                      handleDelete(comment._id);
                                      setShowActions(false);
                                  }}
                              >
                                  Delete
                              </button>
                          </div>
                      )}
                  </div>
              )}
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
    </Container>
  );
};

export default CommentsSection;