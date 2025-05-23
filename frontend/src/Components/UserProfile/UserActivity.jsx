import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Box,
} from '@mui/material';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

// Display user activity logic
const UserActivity = () => {
  const { user } = useContext(AuthContext);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetching all comments from the user
  useEffect(() => {
    if (user && user._id) {
      const token =
        user.token ||
        (localStorage.getItem('user') &&
          JSON.parse(localStorage.getItem('user')).token);
      const fetchUserComments = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/comments/user/${user._id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error('Error fetching comments');
          }
          const data = await response.json();
          setActivity(data);
        } catch (err) {
          console.error(err);
          setError('Error fetching your activity.');
        }
      };
      fetchUserComments();
    }
  }, [user]);

  //in case user doesn't log in
  if (!user) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="warning">Please log in to view your activity.</Alert>
      </Container>
    );
  }

  // Group comments by location
  const groupedByLocation = activity.reduce((groups, comment) => {
    const locationId =
      comment.location && comment.location._id
        ? comment.location._id
        : 'unknown';
    if (!groups[locationId]) {
      groups[locationId] = {
        location: comment.location || { name: 'Unknown Location', _id: 'unknown' },
        comments: [],
      };
    }
    groups[locationId].comments.push(comment);
    return groups;
  }, {});

  const groupedData = Object.values(groupedByLocation);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: '#f0f8ff',
        fontFamily: 'Poppins, sans-serif',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* Top Header Section */}
      <Container
        sx={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          bgcolor: '#f0f8ff',
          py: 2,
          zIndex: 1100,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: 'black', padding: 2, fontWeight: 'bold', mb: 1 }}
        >
          Your Activity
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', padding: 2 }}>
          Click on the cards below to view details.
        </Typography>
        <button
          className="close-button"
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/profile`)}
        >
          X
        </button>
        {error && <Alert severity="error">{error}</Alert>}
      </Container>

      {/* Main Content Section */}
      <Container
        sx={{
          width: '100%',
          px: 2,
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          {groupedData.map((group) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              xl={3}
              key={group.location._id || group.location.name}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              {/* Each card shows the name and comment posted of the location */}
              <Card
                sx={{
                  mb: 4,
                  boxShadow: 3,
                  width: '300px',
                }}
              >
                <CardHeader
                  title={group.location.name || 'Unknown Location'}
                  sx={{
                    backgroundColor: 'skyblue',
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    cursor: group.location._id !== 'unknown' ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (group.location._id !== 'unknown') {
                      navigate(`/tours/${group.location._id}`);
                    }
                  }}
                />
                <CardContent>
                  {group.comments.map((comment) => (
                    <Grid
                      key={comment._id}
                      container
                      spacing={2}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: '1px solid #ccc',
                        borderRadius: 1,
                      }}
                    >
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                          <strong>Comment:</strong> {comment.content}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Posted on: {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default UserActivity;