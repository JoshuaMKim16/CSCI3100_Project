import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton}from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${storedUser?.token}` };
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/users', {
        headers: getAuthHeader(),
      });
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`, {
          headers: getAuthHeader(),
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  const handleEdit = (user) => {
    navigate('/admin/users/edit', { state: { user } });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (e) => {
    const page = Number(e.target.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box sx={{ my: 2, padding: 2, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header and filter container */}
      <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10, padding: 2, boxShadow: 'none' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}> 
          User Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 7, mr: 2 }}>
            <TextField
              fullWidth
              label="Filter by name/ email"
              value={filterQuery}
              size="small"
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
              onClick={() => navigate('/admin/users/add')}
            >
              Add New User
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Table for displaying users */}
      <TableContainer component={Paper} sx={{ flex: 1, backgroundColor: '#f0f0f0', overflow: 'auto',  }}>
        <Table aria-label="users table">
          <TableHead sx={{ backgroundColor: 'lightgrey', position: 'sticky', top: 0, zIndex: 1 }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_subscription || 'N/A'}</TableCell>
                <TableCell>{user.is_admin ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(user._id)}
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

export default UserManagement;