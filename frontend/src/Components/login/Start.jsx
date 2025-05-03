import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Start.css';
import logo from './Logo.png'; // Update the path to your logo image
import {
  Box,
  Button
} from '@mui/material';

const Start = () => {
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="header">
      <Box
        sx={{
          position: 'fixed', // Make the sidebar sticky
          top: 0, // Stick to the top of the viewport
          width: '100%',
          bgcolor: '#dbe9f3',
          boxShadow: 0,
          zIndex: 100,
          pt: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}
      >
      <img src={logo} alt="Logo" style={{ width: '10%', marginBottom: '20px' }} />
        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, justifyContent: 'flex-end', width: '100%' }}>
          <Button
            variant="outlined"
            sx={{ mb: 1, mt:-2, color: 'black', borderColor: 'black' }}
            component={Link} 
            to="/login"
          >
            Log In
          </Button>
          <Button
            variant="contained"
            sx={{ mb: 1, mt:-2, mr: 1, color: 'black', bgcolor: '#a9dafd', ml: 1 }} // Added margin-left for spacing
            component={Link} 
            to="/signup"
          >
            Sign Up
          </Button>
        </Box>
      </Box>
      <div className="main-container">
        <p className="welcome-message" >Your Personalized Travel Companion!</p>
        <p className="message">
          Traveltailor delivers personalized travel planning with an itinerary builder, location searches, and easy itinerary sharing—all in one!
        </p>

      {/* GIF Section */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <img 
          src={require('./demo.gif')} 
          alt="Demo" 
          style={{ width: '80%', maxWidth: '600px' }} // Adjust size
        />
      </div>


      </div>
    </div>
  );
};

export default Start;