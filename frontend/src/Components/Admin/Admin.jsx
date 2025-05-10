import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
} from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Admin = () => {
  const [isOpen, setIsOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        fontFamily: 'Poppins, sans-serif',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: isOpen ? '270px' : '0px', 
          height: '100%',
          bgcolor: 'background.paper',
          boxShadow: 2,
          position: 'fixed', 
          top: 0,
          left: 0,
          transition: 'width 0.3s ease-in-out', 
          overflow: 'hidden', 
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Sidebar Header */}
        {isOpen && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              bgcolor: 'background.default',
              boxShadow: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              Welcome, Admin
            </Typography>

            {/* Close Icon */}
            <IconButton
              onClick={toggleSidebar}
              color="error"
              sx={{
                padding: '4px',
                width: 'auto', 
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* Sidebar Content */}
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
          }}
        >
          <Typography
            component={Link}
            to="/admin"
            sx={{
              mb: 2,
              textDecoration: 'none',
              width: '90%', 
              maxWidth: '240px',
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#333',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Dashboard
          </Typography>
          <Typography
            component={Link}
            to="/admin/users"
            sx={{
              mb: 2,
              textDecoration: 'none',
              width: '90%',
              maxWidth: '240px',
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#333',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Manage Users
          </Typography>
          <Typography
            component={Link}
            to="/admin/locations"
            sx={{
              mb: 2,
              textDecoration: 'none',
              width: '90%',
              maxWidth: '240px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Manage Locations
          </Typography>
          <Typography
            component={Link}
            to="/login"
            sx={{
              textDecoration: 'none',
              width: '90%',
              maxWidth: '240px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'error.main',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Log Out
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#f5f5f5',
          ml: isOpen ? '270px' : '0px', 
          width: `calc(100% - ${isOpen ? '270px' : '0px'})`, 
          transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out', 
          p: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
          }}
        >
          {/* Menu Icon */}
          {!isOpen && (
            <IconButton
              onClick={toggleSidebar}
              color="primary"
              sx={{
                padding: '4px',
                mr: 2, 
                width: 'auto', 
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            Admin Panel
          </Typography>
        </Box>
        <Outlet />
      </Box>
    </Container>
  );
};

export default Admin;