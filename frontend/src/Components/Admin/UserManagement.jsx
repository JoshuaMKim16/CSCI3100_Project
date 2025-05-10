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

// For displyaing user informations
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
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
        {/* Header and Search Section */}
        <Box
          sx={{
            backgroundColor: 'white',
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            User Management
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
              label="Filter by name/ email"
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
              onClick={() => navigate('/admin/users/add')}
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
              Add New User
            </Button>
          </Box>
        </Box>

        {/* Table for displaying users */}
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
          {/* Table Header */}
          <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Subscription</TableCell>
                  <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Admin</TableCell>
                  <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              {/* Table content and Action buttons*/}
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
                        disableElevation
                        size="small"
                        sx={{
                          backgroundColor: 'skyblue',
                          '&:hover': {
                            backgroundColor: 'skyblue',
                          },
                          color: 'black',
                          boxShadow: 'none',
                          mr: 1,
                        }}
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

export default UserManagement;