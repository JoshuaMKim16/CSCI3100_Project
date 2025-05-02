import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
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
    <div className="tour_card">
      <Card>
        <div className="tour_img">
        {specificImage && (
          <div>
            {specificImage.secure_url && (
              <img
                src={specificImage.secure_url}
                alt={specificImage.public_id}
                style={{ width: 'auto', height: 'auto' }}
              />
            )}
          </div>
          )}
        </div>
        <CardBody>
          <div className="card_top d-flex align-items-center justify-content-between">
            <span className="tour_location d-flex align-items-center gap-1">
              {location.address}
            </span>
          </div>
          <h5 className="tour_name">
            <Link to={`/tours/${location._id}`}>{location.name}</Link>
          </h5>
          <div>
            <h6>{location.type.join(', ')}</h6>
          </div>
          <div className="card_bottom d-flex align-items-center justify-content-between mt-3">
            <h5>{location.price? `${location.price}` : '$0'} <span>/per person</span></h5>
            <Button className="btn primary__btn w-100 mt-4" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={handleClick}>
              View Details
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;