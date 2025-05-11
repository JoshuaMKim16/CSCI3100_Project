import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Start.css';
import { AppBar, Toolbar, Box, Button } from '@mui/material';

// Starting Page
const Start = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null); // Reference for the video element

  useEffect(() => {
    // Set video playback speed to 0.6x
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  return (
    <div
      className="header"
      style={{
        fontFamily: 'Poppins, sans-serif',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1, 
        }}
      >
        <source src={require('./LogInVideo.mp4')} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* AppBar (Navbar) */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          zIndex: 1300,
        }}
      >
        <Toolbar sx={{ position: 'relative' }}>
          {/* Cursive TravelTailor Title in Top Left */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              fontFamily: 'cursive',
              fontSize: '32px',
              color: 'black',
              zIndex: 2,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            TravelTailor
          </div>

          {/* Right Section (Login and Signup Buttons) */}
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              textAlign: 'right',
              marginLeft: 'auto',
              marginTop: '10px',
            }}
          >
            <Button
              onClick={() => navigate('/login')}
              sx={{
                color: 'black',
                fontFamily: 'Poppins, sans-serif',
                padding: '10px 30px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '2px solid black',
              }}
            >
              LOGIN
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              sx={{
                color: 'white',
                backgroundColor: 'skyblue',
                fontFamily: 'Poppins, sans-serif',
                padding: '10px 40px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#008cba',
                },
              }}
            >
              SIGNUP
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <div className="main-container" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <p
          className="welcome-message"
          style={{
            fontSize: '50px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          Your Personalized Travel Companion!
        </p>
        <p
          className="message"
          style={{
            fontSize: '25px',
            textAlign: 'center',
            margin: '20px',
            color: 'white',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
          }}
        >
          TravelTailor delivers personalized travel planning with an itinerary builder,
          location searches, and easy itinerary sharing--all in one!
        </p>
      </div>
    </div>
  );
};

export default Start;