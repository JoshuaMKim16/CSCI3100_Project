// /client/src/Components/TourDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import CommentsSection from './CommentsSection';
import { jwtDecode } from 'jwt-decode';
import "./tour-details.css";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const TourDetails = () => {
  // Get parameters from URL
  const { id } = useParams();

  // States for fetching location details
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);

  // States for Google Map
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // States for fetching images
  const [specificImage, setSpecificImage] = useState(null);
  const [fetchError, setFetchError] = useState('');

  // Helper function to retrieve the current user ID from the JWT
  const getCurrentUserIdFromJWT = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.token) {
          const decodedToken = jwtDecode(parsedData.token);
          // Adjust based on your JWT payload structure (e.g., id or userId)
          return decodedToken.id || decodedToken.userId;
        }
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
    return 'guest';
  };

  // Use the JWT-derived user identifier to form a unique storage key.
  const userId = getCurrentUserIdFromJWT();
  const cartKey = `shoppingCart_${userId}`;

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

  // Fetch a specific image by filename
  const fetchSpecificImage = async () => {
    try {
      const filename = location.picture[0].split('/').pop().split('.')[0];
      const response = await fetch(`http://localhost:3000/api/photos/${filename}`);
      if (!response.ok) {
        throw new Error('Fetching specific image failed');
      }
      const data = await response.json();
      console.log(response);
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

  useEffect(() => {
    if (!location?.address) return;
    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location.address)}&key=${process.env.REACT_APP_MAP_APIKEY}`
        );
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

  // Custom LoadScript component to avoid duplicate Google API injections
  class LoadScriptOnlyIfNeeded extends LoadScript {
    componentDidMount() {
      const cleaningUp = true;
      const isBrowser = typeof document !== "undefined";
      const isAlreadyLoaded =
        window.google &&
        window.google.maps &&
        document.querySelector("body.first-hit-completed");
      if (!isAlreadyLoaded && isBrowser) {
        if (window.google && !cleaningUp) {
          console.error("google api is already presented");
          return;
        }
        this.isCleaningUp().then(this.injectScript);
      }

      if (isAlreadyLoaded) {
        this.setState({ loaded: true });
      }
    }
  }

  // Handle Add to Cart using the same cartKey as ShoppingCart
  const handleAddToCart = (e) => {
    e.preventDefault();
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const isAlreadyInCart = currentCart.some(item => item.id === location._id);
    if (!isAlreadyInCart) {
      const newCartItem = {
        id: location._id,
        name: location.name,
        price: location.price
      };
      currentCart.push(newCartItem);
      localStorage.setItem(cartKey, JSON.stringify(currentCart));
      // Dispatch custom event to notify ShoppingCart
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    const userWantsToCheck = window.confirm("It is added to the planner. Do you want to check?");
    if (userWantsToCheck) {
      navigate('/planner');
    }
  };

  // New handler for navigating to the profile page
  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="7">
            {specificImage && (
              <div>
                {specificImage.secure_url && (
                  <img
                    src={specificImage.secure_url}
                    alt={specificImage.public_id}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}
              </div>
            )}
          </Col>
          <Col lg="5">
            <div className="tour_info">
              <h2>{location.name}</h2>
              <div className="d-flex align-items-center gap-5">
                <span>
                  <i className="ri-map-pin-line"></i>{location.address}
                </span>
              </div>
              <div className="tour_extra-details">
                <span>
                  <i className="ri-money-dollar-circle-line"></i>
                  ${location.price} /person
                </span>
                <span>
                  <i className="ri-map-pin-2-line"></i>
                  {location.type && location.type.join(', ')}
                </span>
              </div>
              <h5>Description</h5>
              {location.description ? (
                <p>{location.description}</p>
              ) : (
                <p>No description available.</p>
              )}
            </div>
            <Button className="btn primary__btn w-100 mt-4" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button className="btn secondary__btn w-100 mt-2" onClick={handleProfileNavigation}>
              Go to Profile
            </Button>
          </Col>
        </Row>
        <br />
        <LoadScriptOnlyIfNeeded googleMapsApiKey={process.env.REACT_APP_MAP_APIKEY} libraries={['marker']}>
          {isMapLoaded && (
            <GoogleMap ref={mapRef} mapContainerStyle={containerStyle} center={mapCenter} zoom={16}>
              <MarkerF position={mapCenter} />
            </GoogleMap>
          )}
        </LoadScriptOnlyIfNeeded>
        {location._id && <CommentsSection locationId={location._id} />}
      </Container>
    </section>
  );
};

export default TourDetails;