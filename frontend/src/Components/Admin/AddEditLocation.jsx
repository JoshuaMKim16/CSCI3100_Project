import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

const AddEditLocation = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const [name, setName] = useState(locationState?.location?.name || '');
  const [address, setAddress] = useState(locationState?.location?.address || '');
  const [price, setPrice] = useState(locationState?.location?.price || '');
  const [type, setType] = useState(locationState?.location?.type?.join(', ') || '');
  const [picture, setPicture] = useState(locationState?.location?.picture?.join(', ') || '');
  const [coordinates, setCoordinates] = useState(
    (locationState?.location?.location || [0, 0]).join(', ')
  );
  const [openingHours, setOpeningHours] = useState(
    (locationState?.location?.opening_hour || [0, 0]).join(', ')
  );

  const locId = locationState?.location?._id;

  const getAuthHeader = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${storedUser?.token}` };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const locationData = {
      name,
      address,
      price,
      type: type.split(',').map((item) => item.trim()),
      picture: picture.split(',').map((item) => item.trim()),
      location: coordinates.split(',').map((item) => parseFloat(item.trim())),
      opening_hour: openingHours.split(',').map((item) => parseInt(item.trim(), 10)),
    };

    try {
      if (locId) {
        await axios.put(`http://localhost:3000/api/locations/${locId}`, locationData, {
          headers: getAuthHeader(),
        });
      } else {
        await axios.post('http://localhost:3000/api/locations', locationData, {
          headers: getAuthHeader(),
        });
      }
      navigate('/admin/locations');
    } catch (error) {
      console.error('Error saving location data', error);
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
            {locId ? 'Edit Location' : 'Add New Location'}
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
            label="Address"
            value={address}
            fullWidth
            required
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            fullWidth
            required
            onChange={(e) => setPrice(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Categories (comma separated)"
            value={type}
            fullWidth
            onChange={(e) => setType(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pictures (comma separated file names)"
            value={picture}
            fullWidth
            onChange={(e) => setPicture(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Coordinates (longitude, latitude)"
            value={coordinates}
            fullWidth
            required
            onChange={(e) => setCoordinates(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Opening Hours (e.g., 900,1700)"
            value={openingHours}
            fullWidth
            required
            onChange={(e) => setOpeningHours(e.target.value)}
            sx={{ mb: 2 }}
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
              {locId ? 'Update Location' : 'Create Location'}
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

export default AddEditLocation;