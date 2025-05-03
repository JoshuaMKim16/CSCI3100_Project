import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const locationsPerPage = 6;
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${storedUser?.token}` };
  };

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/locations', {
        headers: getAuthHeader(),
      });
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
        await axios.delete(`http://localhost:3000/api/locations/${id}`, {
          headers: getAuthHeader(),
        });
        fetchLocations();
      } catch (error) {
        console.error('Error deleting location', error);
      }
    }
  };

  const handleEdit = (locationData) => {
    navigate('/admin/locations/edit', { state: { location: locationData } });
  };

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);
  const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);

  const handlePageChange = (e) => {
    const page = Number(e.target.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box sx={{ my: 2, padding: 2, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header and filter container */}
      <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10, padding: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}> 
          Location Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 7, mr: 2 }}>
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
          <Box sx={{ flex: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/admin/locations/add')}
            >
              Add New Location
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Table for displaying locations */}
      <TableContainer component={Paper} sx={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        <Table aria-label="locations table">
          <TableHead sx={{ backgroundColor: 'lightgrey', position: 'sticky', top: 0, zIndex: 1 }}>
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

      {/* Pagination with icons and enlarged input for page number */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
          <IconButton
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            aria-label="First Page"
            sx={{ borderRadius: '50%',  width: '20px', height: '20px' }} // Round icon button
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            sx={{ borderRadius: '50%',  width: '20px', height: '20px' }} // Round icon button
          >
            <ChevronLeftIcon />
          </IconButton>
          <TextField
            type="number"
            value={currentPage}
            onChange={handlePageChange}
            inputProps={{ min: 1, max: totalPages }}
            sx={{ width: 80, mx: 1 }} // Enlarged input box
          />
          <Typography variant="body1">of {totalPages}</Typography>
          <IconButton
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            sx={{ borderRadius: '50%',  width: '20px', height: '20px' }} // Round icon button
          >
            <ChevronRightIcon />
          </IconButton>
          <IconButton
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last Page"
            sx={{ borderRadius: '50%',  width: '20px', height: '20px' }} // Round icon button
          >
            <LastPageIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default LocationManagement;