import React, { useState } from 'react';
import { Container, Box, Typography, Button, IconButton } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; // Import Menu icon
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

const Admin = () => {
  const [isOpen, setIsOpen] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev); // Toggle sidebar state
  };

  return (
    <Container
      maxWidth={false} // Disable maxWidth to allow full width
      sx={{
        height: '100vh', // Full height of the viewport
        width: '100%', // Full width of the viewport
        overflowY: 'auto',
        position: 'relative', // Set relative position for the container
      }}
    >
      {/* Menu Icon Button in the Container */}
      <IconButton 
        onClick={toggleSidebar}
        sx={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          zIndex: 101,
          width: '40px', // Fixed width
          height: '40px', 
          borderRadius: '50%', // Circular shape
        }} 
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Sidebar inside the Container */}
      {isOpen && (
        <Box
          sx={{
            position: 'absolute', // Position it within the container
            top: 0,
            left: 0,
            width: '200px', // Set a width for the sidebar
            height: '100%', // Full height
            bgcolor: 'background.paper',
            boxShadow: 2, // Optional: add shadow for depth
            zIndex: 100, // Ensure it is on top
            overflowY: 'auto', // Allow scrolling if content overflows
            pt: 2, // Padding on the top
            display: 'flex',
            flexDirection: 'column', // Align content vertically
            alignItems: 'flex-start', // Align items to the left
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 5, ml: 3}}>
            Welcome! Admin.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, ml: 2 }}>
            <Button variant="text" sx={{ mb: 1, mt: 1, textAlign: 'left', justifyContent: 'flex-start' }} component={Link} to="/admin/users">
              Manage Users
            </Button>
            <Button variant="text" sx={{ mb: 1, textAlign: 'left', justifyContent: 'flex-start' }} component={Link} to="/admin/locations">
              Manage Locations
            </Button>
            <Button variant="text" color="warning" sx={{ textAlign: 'left', justifyContent: 'flex-start' }} component={Link} to="/login">
              Log Out
            </Button>
          </Box>
        </Box>
      )}

      {/* The rendered child pages will appear next to the sidebar */}
      <Box sx={{ ml: isOpen ? '200px' : 0, mt: 2 }}> {/* Adjust margin-left based on sidebar width */}
        <Outlet />
      </Box>
    </Container>
  );
};

export default Admin;