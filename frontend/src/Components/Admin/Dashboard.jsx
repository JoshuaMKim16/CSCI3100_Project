// Components/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const Dashboard = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [locationCount, setLocationCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the admin's id from localStorage (set after login)
    const storedUser = localStorage.getItem('user');
    const adminId = storedUser ? JSON.parse(storedUser)._id : null;

    // Base API URL
    const baseUrl = 'http://localhost:3000';

    // Fetch admin profile by ID
    const fetchAdminProfile = async () => {
      if (!adminId) return;
      try {
        const response = await fetch(`${baseUrl}/api/users/${adminId}`);
        if (!response.ok) throw new Error('Failed to fetch admin profile');
        const data = await response.json();
        setAdminProfile(data);
      } catch (error) {
        console.error('Admin profile fetch error:', error);
      }
    };

    // Fetch count of all users
    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        setUserCount(users.length);
      } catch (error) {
        console.error('Users fetch error:', error);
      }
    };

    // Fetch count of all locations
    const fetchLocationCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/locations`);
        if (!response.ok) throw new Error('Failed to fetch locations');
        const locations = await response.json();
        setLocationCount(locations.length);
      } catch (error) {
        console.error('Locations fetch error:', error);
      }
    };

    // Fetch count of all comments
    const fetchCommentCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/comments`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const comments = await response.json();
        setCommentCount(comments.length);
      } catch (error) {
        console.error('Comments fetch error:', error);
      }
    };

    // Fetch all data concurrently
    Promise.all([
      fetchAdminProfile(),
      fetchUserCount(),
      fetchLocationCount(),
      fetchCommentCount()
    ])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  // Prepare chart data once counts are available
  const chartData =
    userCount !== null && commentCount !== null && locationCount !== null
      ? [
          { name: 'Users', total: userCount },
          { name: 'Comments', total: commentCount },
          { name: 'Locations', total: locationCount }
        ]
      : [];

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box >
      <Paper elevation={3} sx={{ p: 3, mb: 4, boxShadow: 'none', width:'500px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Profile
        </Typography>
        {adminProfile ? (
          <Box sx={{ mb: 2, boxShadow: 0,}}>
            <Typography variant="h6">
              Name: {adminProfile.name}
            </Typography>
            <Typography variant="h6">
              Email: {adminProfile.email}
            </Typography>
            <Typography variant="h6">
              Role: Admin
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1">
            Unable to load admin profile.
          </Typography>
        )}
        <Typography variant="body1">
          {adminProfile ? adminProfile.bio : ''}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, boxShadow: 'none', width: '800px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dashboard Metrics
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;