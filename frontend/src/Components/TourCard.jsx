import React, { useState, useEffect } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
// import calculateAvgRating from "../utils/avgRating"; // remains same, located in /utils
import "./tour-card.css"; 

const TourCard = ({ location }) => {
  const [imageSrc, setImageSrc] = useState(null);

  // Fetch the image asset for the tour
  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageModule = await import(`../assets/site_data/${location.picture}`);
        setImageSrc(imageModule.default);
      } catch (error) {
        console.error('Error loading the image:', error);
      }
    };
    loadImage();
  }, [location.picture]);

  return (
    <div className="tour_card">
      <Card>
        <div className="tour_img">
          {imageSrc && <img src={imageSrc} alt="tour-image" />}
        </div>
        <CardBody>
          <div className="card_top d-flex align-items-center justify-content-between">
            <span className="tour_location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {location.address}
            </span>
          </div>
          <h5 className="tour_name">
            <Link to={`/tours/${location._id}`}>{location.name}</Link>
          </h5>
          <div>
            <h6>{location.type.join(', ')}</h6>
          </div>
          <div className="card_bottom d-flex align-items-center justify-content-between mt-3">
            <h5>${location.price} <span> /per person</span></h5>
            <button className="btn booking_btn">
              <Link to={`/tours/${location._id}`}>View Details</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;