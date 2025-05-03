// AddEditLocation.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
        await axios.put(`http://localhost:3000/api/locations/${locId}`, locationData);
      } else {
        await axios.post('http://localhost:3000/api/locations', locationData);
      }
      navigate('/admin/locations');
    } catch (error) {
      console.error('Error saving location data', error);
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
          width: '500px'
        }}
      >
        <Typography variant="h5" align="left" sx={{ fontWeight: 'bold'}}>
          {locId ? 'Edit Location' : 'Add New Location'}
        </Typography>
        <TextField
          label="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          required
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Categories (comma separated)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <TextField
          label="Pictures (comma separated file names)"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
        />
        <TextField
          label="Coordinates (longitude, latitude)"
          value={coordinates}
          required
          onChange={(e) => setCoordinates(e.target.value)}
        />
        <TextField
          label="Opening Hours (e.g., 900,1700)"
          value={openingHours}
          required
          onChange={(e) => setOpeningHours(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Button variant="contained" type="submit">
            {locId ? 'Update Location' : 'Create Location'}
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddEditLocation;