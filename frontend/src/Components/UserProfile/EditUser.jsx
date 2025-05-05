import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { AuthContext } from '../utils/AuthContext';

const EditUser = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(locationState?.user?.name || '');
  const [email, setEmail] = useState(locationState?.user?.email || '');
  const [password, setPassword] = useState('');

  const userId = locationState?.user?._id;

  const getAuthHeader = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${storedUser?.token}` };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      ...(password && { password }),
    };

    try {
        // Retrieve token from localStorage (ensure user.token exists)
        const token = user.token || JSON.parse(localStorage.getItem('user')).token;
      
        // Prepare the user data for submission
        const userData = {
          name,
          email,
          ...(password && { password }),
        };
      
        let response;
      
        if (userId) {
          response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          });
        } else {
          response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          });
        }
      
        if (!response.ok) {
          throw new Error('Failed to save user data. Please try again.');
        }
      
        const updatedUser = await response.json();
        setUser(updatedUser);
      
        alert('User data saved successfully!');
        navigate('/profile');
      
      } catch (error) {
        console.error('Error saving user data', error);
        alert(error.message);
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
            Edit Profile
          </Typography>

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
              Update
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

export default EditUser;