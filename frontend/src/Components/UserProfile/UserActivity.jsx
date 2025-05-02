// UserActivity.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import { AuthContext } from '../utils/AuthContext';

const UserActivity = () => {
  const { user } = useContext(AuthContext);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user._id) {
      const fetchUserComments = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/comments/user/${user._id}`);
          if (!response.ok) {
            throw new Error('Error fetching comments');
          }
          const data = await response.json();
          setActivity(data);
        } catch (err) {
          console.error(err);
          setError('Error fetching your activity.');
        }
      };
      fetchUserComments();
    }
  }, [user]);

  if (!user) {
    return (
      <Container className="user-activity-container">
        <Alert color="warning">Please log in to view your activity.</Alert>
      </Container>
    );
  }

  return (
    <Container className="user-activity-container" style={{ marginTop: '2rem' }}>
      <h2>Your Activity</h2>
      {error && <Alert color="danger">{error}</Alert>}
      {activity.length === 0 ? (
        <Alert color="info">No activity found. You haven't made any comments yet.</Alert>
      ) : (
        activity.map((comment) => (
          <Row key={comment._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd' }}>
            <Col md="8">
              <p><strong>Comment:</strong> {comment.content}</p>
            </Col>
            <Col md="4">
              <p>
                <strong>Location:</strong>{" "}
                {typeof comment.location === 'object' 
                  ? comment.location.name || 'Unknown Location' 
                  : comment.location || 'Unknown'}
              </p>
            </Col>
          </Row>
        ))
      )}
    </Container>
  );
};

export default UserActivity;