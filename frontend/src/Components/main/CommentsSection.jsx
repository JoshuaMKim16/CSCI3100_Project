import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardBody,
  Form,
  InputGroup,
  Input,
  ListGroup,
  ListGroupItem,
  Badge,
  Spinner,
  Alert,
  Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faThumbsDown,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import './comments-section.css';

const CommentsSection = ({ locationId }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId     = storedUser._id;
  const token      = storedUser.token || '';

  const [comments, setComments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [newComment, setNewComment] = useState({ content: '' });
  const [editing, setEditing]       = useState({ id: null, content: '' });
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Fetch comments on mount or when locationId changes
  useEffect(() => {
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
        const data = await res.json();
        setComments(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Could not load comments.');
      } finally {
        setLoading(false);
      }
    };

    if (locationId) fetchComments();
  }, [locationId, token]);

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
      setMenuOpenId(null);
    } catch (err) {
      console.error(err);
      setError('Could not delete comment.');
    }
  };

  // Start editing
  const startEdit = c => {
    setEditing({ id: c._id, content: c.content });
    setMenuOpenId(null);
  };

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
          c._id === updated._id ? { ...c, content: updated.content } : c
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

  const isOwner = c => {
    const auth = c.author;
    return (
      auth &&
      ((typeof auth === 'object' && auth._id === userId) ||
        auth === userId)
    );
  };

  return (
    <Container className="comments-wrapper">
      <h4 className="comments-title">Comments</h4>
      {error && <Alert color="danger">{error}</Alert>}

      {/* New Comment Form */}
      <Card className="mb-3">
        <CardBody>
          <Form onSubmit={handleNewSubmit}>
            <InputGroup>
              <Input
                type="textarea"
                placeholder="Write a comment..."
                value={newComment.content}
                onChange={e => setNewComment({ content: e.target.value })}
                required
              />
              <Button color="primary">Post</Button>
            </InputGroup>
          </Form>
        </CardBody>
      </Card>

      {/* Comment List */}
      {loading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <ListGroup flush>
          {comments.length === 0 && (
            <ListGroupItem className="text-center text-muted">
              No comments yet.
            </ListGroupItem>
          )}
          {comments.map(c => (
            <ListGroupItem
              key={c._id}
              className="comment-item"
              style={{ position: 'relative' }}
            >
              <div className="header-row">
                <div>
                  <strong>{c.author?.name || 'User'}</strong>{' '}
                  <Badge color="light" className="timestamp">
                    {new Date(c.createdAt).toLocaleString()}
                  </Badge>
                </div>

                {isOwner(c) && (
                  <div className="more-container">
                    <button
                      className="more-btn"
                      onClick={() =>
                        setMenuOpenId(menuOpenId === c._id ? null : c._id)
                      }
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {menuOpenId === c._id && (
                      <div className="more-menu">
                        <button
                          className="menu-item text-primary"
                          onClick={() => startEdit(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="menu-item text-danger"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editing.id === c._id ? (
                <Form onSubmit={submitEdit} className="mt-2">
                  <Input
                    type="textarea"
                    value={editing.content}
                    onChange={e =>
                      setEditing({ ...editing, content: e.target.value })
                    }
                    required
                  />
                  <div className="mt-2">
                    <button
                      type="submit"
                      className="btn btn-sm btn-success me-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditing({ id: null, content: '' })}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              ) : (
                <p className="mt-2 mb-1">{c.content}</p>
              )}

              <div className="comment-actions">
                <div className="reaction-buttons">
                  <button
                    className="like-btn"
                    onClick={() => reactTo(c._id, 'like')}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span className="ms-1">{c.likes || 0}</span>
                  </button>
                  <button
                    className="dislike-btn"
                    onClick={() => reactTo(c._id, 'dislike')}
                  >
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <span className="ms-1">{c.dislikes || 0}</span>
                  </button>
                </div>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default CommentsSection;