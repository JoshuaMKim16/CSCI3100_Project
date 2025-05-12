import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';

// for displyaing location informations
const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const locationsPerPage = 5;
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${storedUser?.token}` };
  };

  // Fetching location
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

  // Location delete
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

  // Location edit
  const handleEdit = (locationData) => {
    navigate('/admin/locations/edit', { state: { location: locationData } });
  };

  // Location search filter logic
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
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        overflowY: 'scroll',
        boxSizing: 'border-box',
        p: { xs: 2, sm: 3 },
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
        {/* Header and filter container */}
        <Box
          sx={{
            backgroundcolor: 'black',
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
              alignItems: 'center',
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Filter by name/ address"
              value={filterQuery}
              variant="outlined"
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setCurrentPage(1);
              }}
              sx={{ fontSize: '14px', flex: 3 }}
            />
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate('/admin/locations/add')}
              fullWidth
              sx={{
                fontSize: '14px',
                flex: 1,
                backgroundColor: 'skyblue',
                '&:hover': {
                  backgroundColor: 'skyblue',
                },
                color: 'black',
                whiteSpace: 'nowrap',
                boxShadow: 'none',
                padding: '15px 20px',
              }}
            >
              Add New Location
            </Button>
          </Box>
        </Box>

      {/* Table for displaying locations */}
      <Box
          sx={{
            backgroundcolor: 'black',
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
        {/* Table Header */}
        <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Address</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Categories</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

          {/* Table content and Action buttons */}
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
                      outline: '1px',
                      '&:hover': {
                        backgroundColor: 'skyblue',
                      },
                      color: 'black',
                      boxShadow: 'none',
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

      {/* Pagination section */}
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