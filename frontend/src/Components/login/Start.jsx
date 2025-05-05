import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Start.css';
import logo from './Logo.png'; // Update the path to your logo image
import {
  AppBar,
  Toolbar,
  Box,
  Button,
} from '@mui/material';

const Start = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null); // Create a reference for the video element

  useEffect(() => {
    // Set video playback speed to 0.5x
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  return (
    <div className="header" style={{ fontFamily: 'Poppins, sans-serif', position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Video Background */}
      <video
        ref={videoRef} // Attach the reference to the video element
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
          zIndex: -1, // Ensure the video stays behind everything else
        }}
      >
        <source src={require('./LogInVideo.mp4')} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* AppBar (Navbar) */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          zIndex: 1300,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Left Section (Logo Button) */}
          <Box sx={{ display: "flex", gap: "20px", textAlign: "left" }}>
            <Button
              color="inherit"
              sx={{
                color: "black",
                fontSize: "24px", // Larger font for the logo
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/")}
            >
              LOGO
            </Button>
          </Box>

          {/* Right Section (Login and Signup Buttons) */}
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              textAlign: "right",
              marginTop: "10px", // Lower the buttons
            }}
          >
            <Button
              onClick={() => navigate("/login")}
              sx={{
                color: "black",
                fontFamily: "Poppins, sans-serif",
                padding: "10px 30px", // Increased padding for larger buttons
                borderRadius: "8px",
                fontSize: "14px", // Larger font size
                fontWeight: "bold",
                border: "2px solid black",
              }}
            >
              LOGIN
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              sx={{
                color: "white",
                backgroundColor: "skyblue",
                fontFamily: "Poppins, sans-serif",
                padding: "10px 40px", // Increased padding for larger buttons
                borderRadius: "8px",
                fontSize: "14px", // Larger font size
                fontWeight: "bold",
                '&:hover': {
                  backgroundColor: "#008cba", // Slightly darker blue on hover
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
            fontSize: "50px", // Larger welcome message
            fontWeight: "bold",
            textAlign: "center",
            color: "white", // Ensure text is visible on the video background
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Add text shadow for better contrast
          }}
        >
          Your Personalized Travel Companion!
        </p>
        <p
          className="message"
          style={{
            fontSize: "25px",
            textAlign: "center",
            margin: "20px",
            color: "white", // Ensure text is visible on the video background
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)", // Add text shadow for better contrast
          }}
        >
          Traveltailor delivers personalized travel planning with an itinerary
          builder, location searches, and easy itinerary sharing—all in one!
        </p>
      </div>
    </div>
  );
};

export default Start;