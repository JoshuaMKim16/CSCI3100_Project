// UserManagement.jsx
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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const navigate = useNavigate();

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/users');
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
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  const handleEdit = (user) => {
    navigate('/admin/users/edit', { state: { user } });
  };

  // Filter users by name or email.
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Pagination logic.
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <Box sx={{ my: 2, padding: 2 }}>
      <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', mt: 3}}> 
        User Management
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          label="Filter by name or email"
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
          onClick={() => navigate('/admin/users/add')}
        >
          Add New User
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{width: '100%', backgroundColor: '#f0f0f0' }}>
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

export default UserManagement;