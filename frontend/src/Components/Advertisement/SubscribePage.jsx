import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import './SubscribePage.css';

// License Key generation logic
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

// Page subscription 
const SubscribePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      const licenseKey = generateLicenseKey();
      // Retrieve token from localStorage (ensure user.token exists)
      const token = user.token || JSON.parse(localStorage.getItem('user')).token;
      
      const response = await fetch(`http://localhost:3000/api/license/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ licenseKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to update license. Please try again.');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      alert(`Subscription successful! Your license key is: ${licenseKey}`);
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

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