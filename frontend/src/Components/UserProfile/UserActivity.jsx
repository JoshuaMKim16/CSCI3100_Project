import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  Card,
  CardHeader,
  CardBody,
  Button,
} from 'reactstrap';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserActivity = () => {
  const { user } = useContext(AuthContext);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      const fetchUserComments = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/comments/user/${user._id}`
          );
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
      <Container className="py-5">
        <Alert color="warning">Please log in to view your activity.</Alert>
      </Container>
    );
  }

  // Group comments by location
  const groupedByLocation = activity.reduce((groups, comment) => {
    const locationId =
      comment.location && comment.location._id ? comment.location._id : 'unknown';
    if (!groups[locationId]) {
      groups[locationId] = {
        location: comment.location || { name: 'Unknown Location', _id: 'unknown' },
        comments: [],
      };
    }
    groups[locationId].comments.push(comment);
    return groups;
  }, {});

  const groupedData = Object.values(groupedByLocation);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Your Activity</h2>
      {error && <Alert color="danger">{error}</Alert>}
      {groupedData.length === 0 ? (
        <Alert color="info">No activity found. You haven't made any comments yet.</Alert>
      ) : (
        groupedData.map(group => (
          <Card key={group.location._id || group.location.name} className="mb-4 shadow-sm">
            <CardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
              <span
                style={{ cursor: group.location._id !== 'unknown' ? 'pointer' : 'default' }}
                onClick={() => {
                  if (group.location._id !== 'unknown') {
                    navigate(`/tours/${group.location._id}`);
                  }
                }}
              >
                {group.location.name || 'Unknown Location'}
              </span>
              {group.location._id !== 'unknown' && (
                <Button
                  color="light"
                  size="sm"
                  onClick={() => navigate(`/tours/${group.location._id}`)}
                >
                  View Details
                </Button>
              )}
            </CardHeader>
            <CardBody>
              {group.comments.map(comment => (
                <Row
                  key={comment._id}
                  className="mb-3 p-3 border rounded align-items-center"
                >
                  <Col xs="12" md="9">
                    <p className="mb-1">
                      <strong>Comment:</strong> {comment.content}
                    </p>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                      Posted on: {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </Col>
                </Row>
              ))}
            </CardBody>
          </Card>
        ))
      )}
    </Container>
  );
};

export default UserActivity;