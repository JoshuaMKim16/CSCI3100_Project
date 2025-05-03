import React, { useContext } from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // If there's no user, show message.
  if (!user) {
    return (
      <Container className="user-profile-container">
        <p>User is not logged in.</p>
      </Container>
    );
  }

  // Determine the subscription status based on the existence of a license key.
  const isSubscribed = Boolean(user.user_subscription);

  // Unsubscribe function to clear the license key
  const handleUnsubscribe = async () => {
    if (!window.confirm("Are you sure you want to unsubscribe?")) {
      return;
    }
    
    // Retrieve the token from user or localStorage.
    const token = user.token || (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).token);

    try {
      const response = await fetch(`http://localhost:3000/api/license/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }

      // Update the AuthContext with the updated user data
      const updatedUser = await response.json();
      
      // Update user in context and localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert('You have successfully unsubscribed.');
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Error unsubscribing. Please try again later.');
    }
  };

  return (
    <Container className="user-profile-container">
      <Row className="profile-header">
        <Col md="3">
          <img
            src={user.picture || '/default-profile.png'}
            alt="Profile"
            className="profile-image"
          />
        </Col>
        <Col md="9">
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Region: Hong Kong</p>
          {/* Display subscription status */}
          {isSubscribed ? (
            <Alert color="success">
              Subscription Status: Ad-Free
            </Alert>
          ) : (
            <Alert color="warning">
              Subscription Status: Not Subscribed. Enjoy an ad‑free experience by subscribing.
            </Alert>
          )}
          
          <div className="profile-actions">
            <Button color="primary" onClick={() => navigate('/activity')}>
              Your Activity
            </Button>
            { !isSubscribed ? (
              <Button 
                color="success" 
                onClick={() => navigate('/subscribe')}
              >
                Subscribe
              </Button>
            ) : (
              <Button 
                color="info"
                onClick={handleUnsubscribe}
              >
                Unsubscribe
              </Button>
            )}
            <Button
              color="danger"
              onClick={() => {
                // Log out: remove user from storage and update context.
                localStorage.removeItem('user');
                setUser(null);
                navigate('/login');
              }}
            >
              LOG OUT
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="profile-content">
        <Col>
          <h3>Welcome, {user.name}!</h3>
          <p>
            Use the buttons above to view your activity, subscribe for an ad‑free experience, or log out.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;