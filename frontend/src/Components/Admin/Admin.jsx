// Components/Admin/Admin.jsx
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const Admin = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        width: '100%',
        overflow: 'none',
        position: 'relative'
      }}
    >
      {/* Header Menu Icon Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 101,
          width: '40px',
          height: '40px',
          borderRadius: '50%'
        }}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Sidebar */}
      {isOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '200px',
            height: '100%',
            bgcolor: 'background.paper',
            boxShadow: 0,
            zIndex: 100,
            pt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 5, ml: 3 }}>
            Welcome! Admin.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, ml: 2 }}>
            <Button
              variant="text"
              sx={{ mb: 1, textAlign: 'left', justifyContent: 'flex-start' }}
              component={Link}
              to="/admin"
            >
              Dashboard
            </Button>
            <Button
              variant="text"
              sx={{ mb: 1, textAlign: 'left', justifyContent: 'flex-start' }}
              component={Link}
              to="/admin/users"
            >
              Manage Users
            </Button>
            <Button
              variant="text"
              sx={{ mb: 1, textAlign: 'left', justifyContent: 'flex-start' }}
              component={Link}
              to="/admin/locations"
            >
              Manage Locations
            </Button>
            <Button
              variant="text"
              color="warning"
              sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              component={Link}
              to="/login"
            >
              Log Out
            </Button>
          </Box>
        </Box>
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          ml: isOpen ? '200px' : 0,
          mt: 2,
          transition: 'margin-left 0.3s',
          p: 2
        }}
      >
        {/* This renders the matched nested route */}
        <Outlet />
      </Box>
    </Container>
  );
};

export default Admin;