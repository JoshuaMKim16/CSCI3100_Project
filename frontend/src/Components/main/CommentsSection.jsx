import React, { useState, useEffect } from 'react';

const CommentsSection = ({ locationId }) => {
  // Get logged-in user
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId     = storedUser._id;
  const token      = storedUser.token || '';

  // State
  const [comments, setComments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [newComment, setNewComment] = useState({ content: '' });
  const [editing, setEditing]       = useState({ id: null, content: '' });

  // State for editing: holds the id of the comment being edited and its new content
  const [editingComment, setEditingComment] = useState({
    id: null,
    content: ''
  });

  // Fetch comments for the given location ID
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/comments/location/${locationId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      setComments(await res.json());
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not load comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationId) fetchComments();
  }, [locationId]);

  // Post new comment
  const handleNewSubmit = async e => {
    e.preventDefault();
    const content = newComment.content.trim();
    if (!content) return;
    try {
      const res = await fetch(`http://localhost:3000/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          author: userId,
          location: locationId
        })
      });
      if (!res.ok) throw new Error(res.statusText);
      const saved = await res.json();
      setComments(prev => prev.concat(saved));
      setNewComment({ content: '' });
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not post comment.');
    }
  };

  // Delete comment
  const handleDelete = async cid => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/comments/${cid}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      setComments(prev => prev.filter(c => c._id !== cid));
    } catch (err) {
      console.error(err);
      setError('Could not delete comment.');
    }
  };

  // Start editing
  const startEdit = c => setEditing({ id: c._id, content: c.content });

  // Submit edit
  const submitEdit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/comments/${editing.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ content: editing.content })
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      const updated = await res.json();
      setComments(prev =>
        prev.map(c =>
          c._id === editing.id ? { ...c, content: updated.content } : c
        )
      );
      setEditing({ id: null, content: '' });
    } catch (err) {
      console.error(err);
      setError('Could not edit comment.');
    }
  };

  // Like / Dislike
  const reactTo = async (cid, type) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/comments/${cid}/${type}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      const updated = await res.json();
      setComments(prev =>
        prev.map(c =>
          c._id === cid
            ? { ...c, likes: updated.likes, dislikes: updated.dislikes }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      setError(`Could not ${type} comment.`);
    }
  };

  // Check ownership
  const isOwner = c => {
    const auth = c.author;
    return (
      auth &&
      ((typeof auth === 'object' && auth._id === userId) ||
        auth === userId)
    );
  };

  return (
    <div className="comments-section" style={{ marginTop: '2rem' }}>
      <h3>Comments</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingComment({ id: null, content: '' })}>
                    Cancel
                  </button>
                </form>
              ) : (
                <p>{comment.content}</p>
              )}
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => handleLike(comment._id)} style={{ marginRight: '0.5rem' }}>
                  Like {comment.likes || 0}
                </button>
                <button onClick={() => handleDislike(comment._id)} style={{ marginRight: '0.5rem' }}>
                  Dislike {comment.dislikes || 0}
                </button>
                {isCommentOwner(comment) && (
                  <>
                    <button
                      onClick={() => startEditing(comment)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(comment._id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      <form onSubmit={handleNewCommentSubmit} style={{ marginTop: '1rem' }}>
        <textarea
          name="content"
          value={newComment.content}
          onChange={handleNewCommentChange}
          placeholder="Write your comment here..."
          required
          style={{ width: '100%', height: '100px', padding: '0.5rem' }}
        />
        {/* The author input is hidden since logged in user info is used */}
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;