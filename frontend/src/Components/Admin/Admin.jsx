// Admin.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Box, Button, IconButton, Typography } from '@mui/material';
import Header from './Header';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const Admin = () => {
  return (
    <Box m="20px" bgcolor="lightgray">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
             // backgroundColor: colors.blueAccent[700],
              //color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>


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
      

      {/* The rendered child pages will appear below the header inside this scrollable container */}
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>

    </Container>
    </Box>
  );
};

export default Admin;