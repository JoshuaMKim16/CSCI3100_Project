import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Login.css';

const Start = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleStartClick = () => {
    // Navigate to the signup page
    navigate('/login');
  };

  return (
    <div className="main-container">
      <h1 className="site-title">Traveltailor</h1>
      <p className="welcome-message">Tailored recommendations for every visitor</p>
      <button className="start-button" onClick={handleStartClick}>
        Start
      </button>
    </div>
  );
};

export default Start;