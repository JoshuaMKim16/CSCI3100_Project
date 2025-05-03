// LocationManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const locationsPerPage = 6;
  const navigate = useNavigate();

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/locations');
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await axios.delete(`http://localhost:3000/api/locations/${id}`);
        fetchLocations();
      } catch (error) {
        console.error('Error deleting location', error);
      }
    }
  };

  const handleEdit = (locationData) => {
    navigate('/admin/locations/edit', { state: { location: locationData } });
  };

  // Filter locations by name or address.
  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Pagination logic.
  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);
  const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h5" gutterBottom>
        Location Management
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Filter by name or address"
          value={filterQuery}
          onChange={(e) => {
            setFilterQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outline"
          color="primary"
          onClick={() => navigate('/admin/locations/add')}
        >
          Add New Location
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{width: '100%', backgroundColor: '#f0f0f0' }}>
        <Table aria-label="locations table">
          <TableHead sx={{ backgroundColor: 'lightgrey'}}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentLocations.map((loc) => (
              <TableRow key={loc._id}>
                <TableCell>{loc.name}</TableCell>
                <TableCell>{loc.address}</TableCell>
                <TableCell>${loc.price}</TableCell>
                <TableCell>{(loc.type || []).join(', ')}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(loc)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(loc._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? 'contained' : 'outlined'}
              sx={{ mx: 0.5 }}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default LocationManagement;