import React, { useState, useContext, useRef } from 'react';
import { Container, Grid, Button, Alert, Typography, Box, AppBar, Toolbar } from '@mui/material'; // Updated to MUI
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import ChatbotFAB from "../utils/AIChatbot";
import './UserProfile.css';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const tourSectionRef = useRef(null);

  // If there's no user, show message.
  if (!user) {
    return (
      <Container className="user-profile-container">
        <Typography variant="body1">User is not logged in.</Typography>
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

  // Navbar
  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove the user from local storage
    navigate("/login"); // Navigate back to the login page
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/searchpage", { state: { query: searchTerm } });
  };

  const handleScrollToTours = () => {
    if (tourSectionRef.current) {
      tourSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigateToPlanner = () => {
    navigate("/planner");
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  const navbarFontColor = "white";

  return (
    <div>
      <Container className="user-profile-container" sx={{ width: '100%', bgcolor: 'transparent', py: 2 }}>
        {/* Fixed Banner */}
        <Box className="banner">
          <Typography variant="h3" sx={{ color: 'white', padding: 2, mt: 10, fontWeight: 'bold', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>
            Profile
          </Typography>
        </Box>

        {/* Navbar */}
        <AppBar
          position="fixed"
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center", 
              position: "relative",
            }}
          >
            {/* Left Section: White TravelTailor Logo */}
            <div style={{ display: "flex", gap: "20px", textAlign: "left" }}>
              <Typography
                variant="h4"
                onClick={() => navigate("/")}
                style={{
                  fontFamily: "cursive",
                  fontSize: "32px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                TravelTailor
              </Typography>
            </div>

            {/* Center Section (Navbar Items) */}
            <div
              style={{
                position: "absolute", 
                left: "50%", 
                top: "50%", 
                transform: "translate(-50%, -50%)", 
                display: "flex",
                gap: "30px",
                textAlign: "center",
              }}
            >
              {/* Home Navigation */}
              <Button
                color="inherit"
                onClick={() => navigate("/main")} 
                style={{
                  color: navbarFontColor,
                  fontSize: "18px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                HOME
              </Button>

              {/* Tour Navigation */}
              <Button
                color="inherit"
                onClick={() => navigate("/tour")} 
                style={{
                  color: navbarFontColor,
                  fontSize: "18px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                TOUR
              </Button>

              {/* Forum Navigation */}
              <Button
                color="inherit"
                onClick={() => navigate("/forum")} 
                style={{
                  color: navbarFontColor,
                  fontSize: "18px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                FORUM
              </Button>

              <Button
                color="inherit"
                onClick={handleNavigateToPlanner}
                style={{
                  color: navbarFontColor,
                  fontSize: "18px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                PLANNER
              </Button>
            </div>

            {/* Right Section (Profile Button and Logout) */}
            <div style={{ display: "flex", gap: "15px", textAlign: "right" }}>
              <Button
                color="inherit"
                onClick={handleNavigateToProfile}
                style={{
                  color: navbarFontColor,
                  fontFamily: "Poppins, sans-serif",
                  border: "2px solid white",
                  borderRadius: "10%",
                  padding: "5px 10px",
                  minWidth: "40px",
                  height: "40px",
                  fontSize: "14px",
                }}
              >
                PROFILE
              </Button>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                style={{
                  color: "skyblue",
                  fontFamily: "Poppins, sans-serif",
                  padding: "5px 15px",
                  borderRadius: "5px", 
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                LOGOUT
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        
        {/* User profile picture */}
        <Grid container spacing={3} className="profile-header" sx={{ marginTop: '160px', width: '100%' }}>
          <Grid item md={3} className="profile-image-container">
            <img
              src={user.picture || '/profile_none.png'} 
              className="profile-image"
            />
          </Grid>

          {/* User profile details */}
          <Grid item md={9}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
              <Typography sx={{ mb: 1 }}>Email: {user.email}</Typography>
              <Typography sx={{ mb: 2 }}>Region: Hong Kong</Typography>
            </Box>

            {/* Display subscription status */}
            {isSubscribed ? (
              <Alert severity="success" sx={{ color: 'black', lineHeight: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>Subscription Status: Ad-Free</span>
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ color: 'black', lineHeight: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span>Subscription Status: Not Subscribed.</span>
                  <br />
                  <span className="highlight-text">Enjoy an ad‑free experience by subscribing!</span>
                </div>
              </Alert>
            )}

            {/* Action buttons */}
            <Box className="profile-actions" sx={{
              position: 'fixed',
              top: '25%',
              right: '20%',
              width: '200px',
              bgcolor: 'transparent',
              boxShadow: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
              <Button
                variant="text"
                sx={{ color: 'darkblue', textAlign: 'left', justifyContent: 'flex-start' }}
                onClick={() => navigate('/activity')}
              >
                Your Activity
              </Button>

              {isSubscribed ? (
                <Button
                  variant="text"
                  sx={{ color: "darkblue", textAlign: 'left', justifyContent: 'flex-start' }}
                  onClick={handleUnsubscribe}
                >
                  Unsubscribe
                </Button>
              ) : (
                <Button
                  variant="text"
                  sx={{ color: "darkblue", textAlign: 'left', justifyContent: 'flex-start' }}
                  onClick={() => navigate('/subscribe')}
                >
                  Subscribe
                </Button>
              )}

              <Button
                variant="text"
                sx={{ color: 'darkblue', textAlign: 'left', justifyContent: 'flex-start' }}
                onClick={() => navigate('/edituser', { state: { user } })}
              >
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Grid container className="profile-content">
          <Grid item xs={12}>
            <Typography variant="h6">Welcome, {user.name}!</Typography>
            <Typography>
              Use the buttons above to view your activity, subscribe for an ad‑free experience, or log out.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <ChatbotFAB />
    </div>
  );
};

export default UserProfile;