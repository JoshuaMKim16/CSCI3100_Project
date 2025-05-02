import React, { useState, useEffect } from 'react';
import { Card,  Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
// import calculateAvgRating from "../utils/avgRating"; // remains same, located in /utils
import "./tour-card.css"; 

const TourCard = ({ location }) => {
  // States for fetching images
  const [specificImage, setSpecificImage] = useState(null);
  const [fetchError, setFetchError] = useState('');

  const navigate = useNavigate();

  // Fetch a specific image by filename
  const fetchSpecificImage = async () => {
    try {
      const filename = location.picture[0].split('/').pop().split('.')[0]
      const response = await fetch(`http://localhost:3000/api/photos/${filename}`);
      if (!response.ok) {
        throw new Error('Fetching specific image failed');
      }
      const data = await response.json();
      console.log(response)
      setSpecificImage(data);
      setFetchError('');
    } catch (err) {
      console.error('Error fetching specific image:', err);
      setFetchError('Error fetching specific image: ' + err.message);
    }
  };

  useEffect(() => {
    if (location.picture) {
        fetchSpecificImage();
    }
  }, [location]);

    // Handle click to add to planner
    const handleClick = e => {
      e.preventDefault();
      navigate(`/tours/${location._id}`);
    };

  return (
    <Card className="tour_card" style={{width: '400px'}}>
      <Card.Img
          variant="top"
          src={specificImage?.secure_url}
          alt={specificImage?.public_id}
          style={{height: 'auto', width:'auto'}}
      />
      <Card.Body>
        <Card.Title>
          <Link to={`/tours/${location._id}`}>{location.name}</Link>
        </Card.Title>
        <Card.Subtitle>
            {location.address}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          {location.type.join(', ')}
        </Card.Subtitle>
        <Card.Subtitle>
          {location.price? `${location.price}` : '$0'} <span>/per person</span>
        </Card.Subtitle>
        <br/>
        <Button
          className="w-100 mt-4 btn-sm"
          onClick={handleClick}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TourCard;