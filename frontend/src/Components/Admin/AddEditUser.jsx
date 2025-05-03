// AddEditUser.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const AddEditUser = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const [name, setName] = useState(locationState?.user?.name || '');
  const [email, setEmail] = useState(locationState?.user?.email || '');
  const [password, setPassword] = useState('');
  const [userSubscription, setUserSubscription] = useState(
    locationState?.user?.user_subscription || ''
  );
  const [isAdmin, setIsAdmin] = useState(locationState?.user?.is_admin || false);

  const userId = locationState?.user?._id;

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
        await axios.put(`http://localhost:3000/api/users/${userId}`, userData);
      } else {
        await axios.post('http://localhost:3000/api/users', userData);
      }
      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user data', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: 0,
          bgcolor: 'background.paper',
          width: '400px',
        }}
      >
        <Typography variant="h5" align="left" sx={{ fontWeight: 'bold'}}>
          {userId ? 'Edit User' : 'Add New User'}
        </Typography>
        <TextField
          label="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={userId ? 'New Password (leave blank to keep unchanged)' : 'Password'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={userId ? 'Leave blank if not changing' : ''}
          required={!userId}
        />
        <TextField
          label="Subscription"
          value={userSubscription}
          onChange={(e) => setUserSubscription(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          }
          label="Is Admin?"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Button variant="contained" type="submit">
            {userId ? 'Update User' : 'Create User'}
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddEditUser;