// Admin.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Admin = () => {
  return (
    <Container
      maxWidth="lg"
      // Ensures the overall container takes full viewport height and allows vertical scrolling
      sx={{
        maxHeight: '100vh',
        overflowY: 'auto',
        pb: 4,
      }}
    >
      {/* Sticky header so the h4 and nav remain always visible at the top */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'background.paper',
          pt: 2,
          pb: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box
          component="nav"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button variant="contained" component={Link} to="/admin/users">
            Manage Users
          </Button>
          <Button variant="contained" component={Link} to="/admin/locations">
            Manage Locations
          </Button>
        </Box>
      </Box>

      {/* The rendered child pages will appear below the header inside this scrollable container */}
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default Admin;