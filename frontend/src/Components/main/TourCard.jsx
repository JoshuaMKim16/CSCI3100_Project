import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTag } from 'react-icons/fa';

// Individual card for each location
const TourCard = ({ location }) => {
  const [specificImage, setSpecificImage] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSpecificImage = async () => {
    try {
      const filename = location.picture[0].split('/').pop().split('.')[0];
      const response = await fetch(`http://localhost:3000/api/photos/${filename}`);
      if (!response.ok) {
        throw new Error('Fetching specific image failed');
      }
      const data = await response.json();
      setSpecificImage(data);
      setFetchError('');
    } catch (err) {
      console.error('Error fetching specific image:', err);
      setFetchError('Error fetching specific image: ' + err.message);
    } finally {
      setIsImageLoading(false);
    }
  };

  useEffect(() => {
    if (location.picture) {
      fetchSpecificImage();
    }
  }, [location]);

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/tours/${location._id}`);
  };

  return (
    <Card
      sx={{
        width: 400,
        height: 455,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {isImageLoading ? (
        <Box
          sx={{
            width: '100%',
            height: 200,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <CardMedia
          component="img"
          image={specificImage?.secure_url}
          alt={specificImage?.public_id}
          sx={{
            height: 200,
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/tours/${location._id}`)}
        />
      )}
      <CardContent
        sx={{
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}
        >
          <Link
            to={`/tours/${location._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {location.name}
          </Link>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 0.5,
            whiteSpace: 'normal',
          }}
        >
          <FaMapMarkerAlt style={{ marginRight: 5 }} />
          {location.address}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'normal',
          }}
        >
          <FaTag style={{ marginRight: 5 }} />
          {Array.isArray(location.type) ? location.type.join(', ') : location.type}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
        <Button variant="contained" size="small" onClick={handleClick}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TourCard;