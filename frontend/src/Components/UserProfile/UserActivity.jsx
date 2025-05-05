import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from '@mui/material';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserActivity = () => {
  const { user } = useContext(AuthContext);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      const token = user.token || (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).token);
      const fetchUserComments = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/comments/user/${user._id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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

  if (!user) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="warning">Please log in to view your activity.</Alert>
      </Container>
    );
  }

  // Group comments by location
  const groupedByLocation = activity.reduce((groups, comment) => {
    const locationId = comment.location && comment.location._id ? comment.location._id : 'unknown';
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
    <div
      sx={{
        Height: '100%',
        bgcolor: '#f0f8ff',
        fontFamily: 'Poppins, sans-serif',
        minwidth: '100%', 
      }}
    >
      <Container 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          minwidth: '100%', 
          bgcolor: '#f0f8ff', 
          py: 2, 
          zIndex: 100,
        }}
      >
        <Typography variant="h4" sx={{ color: 'black', padding: 2, fontWeight: 'bold', mb: 1 }}>
          Your Activity
        </Typography>
        <Typography variant="h8" sx={{ color: 'black', padding: 2 }}> Click on the cards below to view details. </Typography>
        <button 
          className="close-button" 
          style={{
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            width: '50px', 
            height: '50px', 
          }}
          onClick={() => navigate(`/profile`)}> 
          X
        </button>

        {error && <Alert severity="error">{error}</Alert>}
      </Container>

      <Container sx={{ pt: 18, maxWidth: { xs: '100%', md: '1200px' }, ml: 1}}>
      <Grid container spacing={1} > 
          {groupedData.map(group => (
            <Grid item xs={12} sm={4} key={group.location._id || group.location.name}>
              <Card sx={{ mb: 4, boxShadow: 3, width: '300px', mx: 'auto' }}> {/* Center the card */}
                <CardHeader
                  title={group.location.name || 'Unknown Location'}
                  action={
                    group.location._id !== 'unknown'
                  }
                  variant="h5"
                  sx={{
                    backgroundColor: 'skyblue',
                    color: 'white',
                    fontWeight: 'bold',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: group.location._id !== 'unknown' ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (group.location._id !== 'unknown') {
                      navigate(`/tours/${group.location._id}`);
                    }
                  }}
                />
                <CardContent>
                  {group.comments.map(comment => (
                    <Grid
                      key={comment._id}
                      container
                      spacing={2}
                      sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}
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
    </div>
  );
};

export default UserActivity;