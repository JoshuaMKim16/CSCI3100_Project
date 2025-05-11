import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';

// Add or Edit user logic
const AddEditUser = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const [name, setName] = useState(locationState?.user?.name || '');
  const [email, setEmail] = useState(locationState?.user?.email || '');
  const [password, setPassword] = useState('');
  const [userSubscription, setUserSubscription] = useState(locationState?.user?.user_subscription || '');
  const [isAdmin, setIsAdmin] = useState(locationState?.user?.is_admin || false);

  const userId = locationState?.user?._id;

  // Get authentication headers from localStorage
  const getAuthHeader = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${storedUser?.token}` };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      ...(password && { password }),
      user_subscription: userSubscription,
      is_admin: isAdmin,
    };

    try {
      if (userId) {
        // Update an existing user
        await axios.put(`http://localhost:3000/api/users/${userId}`, userData, {
          headers: getAuthHeader(),
        });
      } else {
        // Add a new user
        await axios.post('http://localhost:3000/api/users', userData, {
          headers: getAuthHeader(),
        });
      }
      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user data', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
    {/* Form container */}
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: 4,
            borderRadius: 4,
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
            {userId ? 'Edit User' : 'Add New User'}
          </Typography>

          {/* main content of the form */}
          <TextField
            label="Name"
            value={name}
            fullWidth
            required
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={email}
            fullWidth
            required
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label={userId ? 'New Password (leave blank to keep unchanged)' : 'Password'}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={userId ? 'Leave blank if not changing' : ''}
            fullWidth
            sx={{ mb: 2 }}
            required={!userId}
          />
          <TextField
            label="Subscription"
            value={userSubscription}
            fullWidth
            onChange={(e) => setUserSubscription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            }
            label="Is Admin?"
            sx={{ mb: 2 }}
          />

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                width: '48%',
                backgroundColor: 'skyblue',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {userId ? 'Update User' : 'Create User'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                width: '48%',
                color: 'skyblue',
                borderColor: 'skyblue',
                fontWeight: 'bold',
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AddEditUser;