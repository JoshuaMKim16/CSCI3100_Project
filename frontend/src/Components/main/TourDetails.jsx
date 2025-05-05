// /client/src/Components/TourDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FaMapMarkerAlt, FaTag, FaMoneyBillWave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import CommentsSection from './CommentsSection';
import "./tour-details.css";
import ChatbotFAB from "../utils/AIChatbot";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const TourDetails = () => {
  // Get parameters from url
  const { id } = useParams();

  // States for fetching location attributes
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);

  // States for Google Map
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  // States for fetching images
  const [specificImage, setSpecificImage] = useState(null);
  const [fetchError, setFetchError] = useState('');

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
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location.address)}&key=${process.env.REACT_APP_MAP_APIKEY}`);
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

  // Handle sidebar
  const handleAddressClick = () => {
    setShowSidebar(true);
  };
  const handleSidebarClose = () => {
    setShowSidebar(false);
  };

  // Handle 'google api already presented' error
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

  // Handle Add to Cart
  // Fix: Make sure the cart is stored with the same key as in the shopping cart component
  const handleAddToCart = (e) => {
    e.preventDefault();
    
    // Retrieve logged-in user info (adjust logic as per your auth implementation)
    const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
    const userId = loggedInUser._id || 'guest';
    // Use the same key as in ShoppingCart.jsx:
    const cartKey = `shoppingCart_${userId}`;
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
    }

    const userWantsToCheck = window.confirm("It is added to the planner. Do you want to check?");
    if (userWantsToCheck) {
      navigate('/planner');
    }
  };

  return (
    <section>
      {/*Picture and Details*/}
      <Container style={{height: '90vh', width: '100%', margin: '0 auto'}}>      
        <Row style={{display: 'flex', marginTop: '1rem'}}>
          <Col style={{width: '60%'}}>
            {specificImage && (
              <div>
                {specificImage.secure_url && (
                  <img
                    src={specificImage.secure_url}
                    alt={specificImage.public_id}
                    style={{ width: '100%', height: 'auto', borderRadius: '5px'}}
                  />
                )}
              </div>
            )}
          </Col>
          <Col style={{width: '40%'}}>
            <div className="tour_info">
              <h2>{location.name}</h2>
              <div className="d-flex align-items-center gap-5">
                <span>
                  <FaMapMarkerAlt/>{location.address}
                </span>
                <span>
                  <p onClick={handleAddressClick} style={{cursor: 'pointer', color: 'blue'}}>View address on Google Map</p>
                </span>
              </div>
              <div className="tour_extra-details">
                <span>
                  <FaMoneyBillWave/>
                  ${location.price} /person
                  <FaTag/>
                  {location.type && location.type.join(', ')}
                </span>
              </div>
              <h5>Description</h5>
              {location.description ? (
                <p>{location.description}</p>
              ) : (
                <p>No description available</p>
              )}
              <Button className="btn primary__btn w-100 mt-4" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button 
                className="close-button" 
                style={{
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  width: '50px', 
                  height: '50px', 
                  mb: 1 
                }}
                onClick={() => navigate(-1)}> 
                X
              </Button>
            </div>
          </Col>
        </Row>
        <br />

        {/*Google Map*/}
        {showSidebar && (
          <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
            <div className="sidebar-content">
              <h3>Google Map</h3>
              <p onClick={handleSidebarClose} style={{ cursor: 'pointer', color: 'blue'}}>Close</p>
              <LoadScriptOnlyIfNeeded googleMapsApiKey={process.env.REACT_APP_MAP_APIKEY} libraries={['marker']}>
                {isMapLoaded && (
                  <GoogleMap ref={mapRef} mapContainerStyle={containerStyle} center={mapCenter} zoom={16}>
                    <MarkerF position={mapCenter} />
                  </GoogleMap>
                )}
              </LoadScriptOnlyIfNeeded>
            </div>
          </div>
        )}

        {/* Insert the CommentsSection component and pass the location ID */}
        {location._id && <CommentsSection locationId={location._id} />}
      </Container>
      <ChatbotFAB/>
    </section>
  );
};

export default TourDetails;