import React, { useState, useEffect } from 'react';
import { Card,  Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTag, FaMoneyBillWave } from'react-icons/fa'
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
    <Card className="tour_card" style={{width: '400px', height: 'auto', boxShadow: '20px', borderRadius: '5px'}}>
      <Card.Img
          variant="top"
          src={specificImage?.secure_url}
          alt={specificImage?.public_id}
          style={{height: 'auto', width:'auto', borderRadius: '5px', cursor: 'pointer'}}
          onClick={() => navigate(`/tours/${location._id}`)}
      />
      <Card.Body style={{padding: '10px'}}>
        <Card.Title>
          <Link to={`/tours/${location._id}`} style={{color: 'blue', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none'}}>{` ${location.name}`}</Link>
        </Card.Title>
        <br/>
        <Card.Subtitle style={{color: 'grey'}}>
          <FaMapMarkerAlt/>
          {` ${location.address}`}
        </Card.Subtitle>
        <Card.Subtitle style={{color: 'grey'}}>
          <FaTag/>
          {` ${location.type.join(', ')}`}
        </Card.Subtitle>
        <Card.Subtitle  style={{color: 'grey'}}>
          <FaMoneyBillWave/>
          {location.price? `${location.price}` : ' N/A '}/ person
        </Card.Subtitle>
        <br/>
        <Button
          variant='primary'
          size='sm'
          style={{width: '30%', position: 'relative', marginBottom: '10px', left: '65%'}}
          onClick={handleClick}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TourCard;