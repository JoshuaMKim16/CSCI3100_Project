import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';

// Add and Edit location logic
const AddEditLocation = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  // Initialize form fields. If editing, prefill with the existing location data
  const [name, setName] = useState(locationState?.location?.name || '');
  const [address, setAddress] = useState(locationState?.location?.address || '');
  const [price, setPrice] = useState(locationState?.location?.price || '');
  const [type, setType] = useState(locationState?.location?.type?.join(', ') || '');
  const [coordinates, setCoordinates] = useState(
    (locationState?.location?.location || [0, 0]).join(', ')
  );
  const [openingHours, setOpeningHours] = useState(
    (locationState?.location?.opening_hour || [0, 0]).join(', ')
  );
  const [description, setDescription] = useState(locationState?.location?.description || '');
  const [pictures, setPictures] = useState([]);
  const [uploading, setUploading] = useState(false);

  const locId = locationState?.location?._id;

  // Get authentication headers from localStorage
  const getAuthHeader = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${storedUser?.token}` };
  };

  // Handle picture upload to Cloudinary
  const handlePictureUpload = async () => {
    const cloudinaryUrl = 'http://localhost:3000/api/photos/upload';
    const formData = new FormData();

    pictures.forEach((file) => {
      formData.append('file', file);
    });

    try {
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (Array.isArray(response.data)) {
        return response.data.map((file) => file.secure_url);
      } else {
        return [response.data.secure_url];
      }
    } catch (error) {
      console.error('Error uploading pictures to Cloudinary:', error);
      return [];
    }
  };

  // Submit helper function to upload pictures then send location data
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', { name, address, price, type, coordinates, openingHours, description, pictures });

    setUploading(true);
    let uploadedPictures = [];

    if (pictures.length > 0) {
      uploadedPictures = await handlePictureUpload();
      if (uploadedPictures.length === 0) {
        setUploading(false);
        alert('Failed to upload pictures. Please try again.');
        return;
      }
    }

    const locationData = {
      name,
      address,
      price,
      type: type.split(',').map((item) => item.trim()),
      picture: uploadedPictures,
      location: coordinates.split(',').map((item) => parseFloat(item.trim())),
      opening_hour: openingHours.split(',').map((item) => parseInt(item.trim(), 10)),
      description,
    };

    console.log('Submitting location data:', locationData);

    try {
      if (locId) {
        await axios.put(
          `http://localhost:3000/api/locations/${locId}`,
          locationData,
          { headers: getAuthHeader() }
        );
      } else {
        await axios.post('http://localhost:3000/api/locations', locationData, {
          headers: getAuthHeader(),
        });
      }
      navigate('/admin/locations');
    } catch (error) {
      console.error('Error saving location data:', error.response?.data || error.message);
      alert('Failed to save location data. Please check your input and try again.');
    } finally {
      setUploading(false);
    }
  };

  // useDropzone integration for file selection
  const onDrop = (acceptedFiles) => {
    setPictures([...pictures, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Poppins, sans-serif',
        paddingTop: '20px',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Form container with a unique id */}
        <Box
          component="form"
          id="locationForm"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: 4,
            borderRadius: 4,
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
            overflowY: 'auto', 
            flexGrow: 1, 
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '120px', 
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
            label="Description"
            value={description}
            fullWidth
            required
            onChange={(e) => setDescription(e.target.value)}
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

          {/* Dropzone for the picture upload */}
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed skyblue',
              borderRadius: 4,
              padding: 4,
              textAlign: 'center',
              backgroundColor: isDragActive ? '#e3f2fd' : 'transparent',
              cursor: 'pointer',
              mt: 3,
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography variant="body2" color="textSecondary">
                Drop the files here...
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Drag and drop some files here, or click to select files
              </Typography>
            )}
          </Box>

          {pictures.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Selected Files:
              </Typography>
              {pictures.map((file, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                  {file.name}
                </Typography>
              ))}
            </Box>
          )}
        </Box>

        {/* Sticky button container */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 2,
            borderTop: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 10, 
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            type="submit"
            form="locationForm"  
            sx={{
              width: '48%',
              backgroundColor: 'skyblue',
              color: 'white',
              fontWeight: 'bold',
            }}
            disabled={uploading}
          >
            {uploading
              ? 'Uploading...'
              : locId
              ? 'Update Location'
              : 'Create Location'}
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
      </Container>
    </div>
  );
};

export default AddEditLocation;