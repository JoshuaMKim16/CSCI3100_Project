import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import "./tour-details.css"; // updated import path
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
// import Booking from ~

// Define the container style for Google Map
const containerStyle = {
  width: '100%',
  height: '400px'
};

const TourDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // Fetch location details by ID
  const fetchLocationByID = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/locations/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setLocation(data);
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Failed to load location details.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchLocationByID(id);
    }
  }, [id]);

  // Load image
  useEffect(() => {
    if (!location.picture) return;
    const loadImage = async () => {
      try {
        const imageModule = await import(`../../assets/site_data/${location.picture}`);
        setImageSrc(imageModule.default);
      } catch (error) {
        console.error('Error loading the image:', error);
      }
    };
    loadImage();
  }, [location.picture]);

  // Convert address to lat and lng using Google Geocoding API   
  useEffect(() => {
    if (!location?.address) return;
    const geocodeAddress = async () => {
      try {
        // Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API Key
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location.address)}&key=YOUR_GOOGLE_MAPS_API_KEY`);
        const data = await response.json();
        if (data.status === 'OK') {
          const { lat, lng } = data.results[0].geometry.location;
          setMapCenter({ lat, lng });
          setIsMapLoaded(true);
        } else {
          console.error('Geocoding failed:', data.status);
        }
      } catch (error) {
        console.error('Error fetching geocoding data:', error);
      }
    };
    geocodeAddress();
  }, [location?.address]);

  // Handle click to add to planner
  const handleClick = e => {
    e.preventDefault();
    navigate('/thank-you');
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="7">
            <div className="tour_content">
              {imageSrc && <img src={imageSrc} alt="tour-image" />}
            </div>
          </Col>
          <Col lg="5">
            <div className="tour_info">
              <h2>{location.name}</h2>
              <div className="d-flex align-items-center gap-5">
                <span>
                  <i className="ri-map-pin-fill"></i>{location.address}
                </span>
              </div>
              <div className="tour_extra-details">
                <span><i className="ri-money-dollar-circle-line"></i>${location.price} /person</span>
                <span><i className="ri-map-pin-2-line"></i>{location.type && location.type.join(', ')}</span>
              </div>
              <h5>Description</h5>
              {location.description ? (
                <p>{location.description}</p>
              ) : (
                <p>No description available</p>
              )}
            </div>
            <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>
              Add to Planner
            </Button>
          </Col>
        </Row>
        <br />
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={['marker']}>
          {isMapLoaded && (
            <GoogleMap ref={mapRef} mapContainerStyle={containerStyle} center={mapCenter} zoom={16}>
              <MarkerF position={mapCenter} />
            </GoogleMap>
          )}
        </LoadScript>
      </Container>
    </section>
  );
};

export default TourDetails;