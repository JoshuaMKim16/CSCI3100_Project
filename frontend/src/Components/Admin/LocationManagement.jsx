import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // Display 5 items per page
  const locationsPerPage = 5;
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${storedUser?.token}` };
  };

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

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh', // Fixed height to fill viewport
        overflowY: 'scroll', // Outer container is scrollable
        boxSizing: 'border-box',
        p: { xs: 2, sm: 3 }, // Responsive padding
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '1200px' },
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Header & Search Section */}
        <Box
          sx={{
            backgroundColor: 'white',
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Location Management
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center', // Vertically align items
              gap: 2, // Space between the search bar and button
            }}
          >
            {/* Search Bar */}
            <TextField
              fullWidth
              label="Search by name or address"
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setCurrentPage(1);
              }}
              variant="outlined"
              sx={{
                fontSize: '14px',
                flex: 3, // Takes 3/4 of the available space
              }}
            />
            {/* Add Button */}
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate('/admin/locations/add')}
              fullWidth
              sx={{
                fontSize: '14px',
                flex: 1, // Takes 1/4 of the available space
                backgroundColor: 'skyblue',
                '&:hover': {
                  backgroundColor: 'skyblue',
                },
                color: 'white', // Ensure text remains visible
                whiteSpace: 'nowrap', // Prevents text wrapping
                boxShadow: 'none', // Removes hover shadow effect
                padding: '15px 20px'
              }}
            >
              Add Location
            </Button>
          </Box>
        </Box>

        {/* Table & Pagination Section */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
          <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Categories</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
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
                        disableElevation
                        size="small"
                        sx={{
                          backgroundColor: 'skyblue',
                          '&:hover': {
                            backgroundColor: 'skyblue',
                          },
                          color: 'white', // Ensure text remains visible
                          boxShadow: 'none', // No shadow effect
                          mr: 1,
                        }}
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

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: { xs: 1, sm: 2 },
              borderTop: '1px solid #e0e0e0',
              mt: 2,
              mb: { xs: 12, sm: 10 },
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LocationManagement;