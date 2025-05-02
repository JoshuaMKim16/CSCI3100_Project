// /client/src/Components/SubscribePage.jsx
import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import './SubscribePage.css';

// Helper function to generate a license key in the format AAAA-BBBB-CCCC-DDDD
function generateLicenseKey() {
  const segment = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

const SubscribePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      // Generate a license key for the user
      const licenseKey = generateLicenseKey();

      // Update the user's license in the backend.
      // Adjust the URL and method as necessary to match your backend API.
      const response = await fetch(`http://localhost:3000/api/license/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseKey }), // saving the license key under user_subscription on the backend
      });

      if (!response.ok) {
        throw new Error('Failed to update license. Please try again.');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      // Inform the user of the generated license key and navigate to /profile
      alert(`Subscription successful! Your license key is: ${licenseKey}`);
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  // Redirect the user to login if not authenticated.
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container className="subscribe-container">
      <Row className="justify-content-center">
        <Col md="6" className="checkout-box">
          <h2 className="text-center mb-4">Subscribe and Get Your License Key</h2>
          <p className="text-center">
            Click below to subscribe and receive your license key for full access.
          </p>
          {errorMsg && <Alert color="danger">{errorMsg}</Alert>}
          <Button color="primary" block onClick={handleSubscribe}>
            Subscribe Now
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SubscribePage;