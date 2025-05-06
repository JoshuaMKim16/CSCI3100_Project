// /client/src/Components/TourDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import { FaMapMarkerAlt, FaTag, FaMoneyBillWave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import CommentsSection from './CommentsSection';
import "./tour-details.css";
import ChatbotFAB from "../utils/AIChatbot";
import hkBackground from "./hk_background1.jpg";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Box,
  IconButton,
} from "@mui/material";

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

  // NavBar
  const navbarFontColor = "black";
  const [navbarVisible, setNavbarVisible] = useState(true);
  const backgroundRef = useRef(null);

  const handleNavigateToPlanner = () => {
    navigate("/planner");
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove the user from local storage
    navigate("/login"); // Navigate back to the login page
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setNavbarVisible(entry.isIntersecting);
    }, {
      root: null,
      rootMargin: "0px",
      threshold: 0
    });

    if (backgroundRef.current) {
      observer.observe(backgroundRef.current);
    }

    return () => {
      if (backgroundRef.current) {
        observer.unobserve(backgroundRef.current);
      }
    };
  }, []);

  return (
    <div
    style={{
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 0,
      fontFamily: "Poppins, sans-serif",
    }}
    >
    <section>
    {/* Navbar */}
    {navbarVisible && (
        <AppBar
          position="fixed"
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Vertically center all items in the navbar
            position: "relative",
          }}
        >
          {/* Left Section (Logo) */}
          <div style={{ display: "flex", gap: "20px", textAlign: "left" }}>
            <Button
              color="inherit"
              style={{
                color: navbarFontColor,
                fontSize: "18px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              LOGO
            </Button>
          </div>

          {/* Center Section (Navbar Items) */}
          <div
            style={{
              position: "absolute", // Position absolutely relative to the toolbar
              left: "50%", // Center horizontally
              top: "50%", // Center vertically
              transform: "translate(-50%, -50%)", // Adjust for exact center alignment
              display: "flex",
              gap: "30px",
              textAlign: "center",
            }}
          >
            {/* Home Navigation */}
            <Button
              color="inherit"
              onClick={() => navigate("/main")} // Navigate to /main
              style={{
                color: navbarFontColor,
                fontSize: "18px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              HOME
            </Button>

            {/* Tour Navigation */}
            <Button
              color="inherit"
              onClick={() => navigate("/tour")} // Navigate to /tour
              style={{
                color: navbarFontColor,
                fontSize: "18px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              TOUR
            </Button>

            {/* Forum Navigation */}
            <Button
              color="inherit"
              onClick={() => navigate("/forum")} // Navigate to /forum
              style={{
                color: navbarFontColor,
                fontSize: "18px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              FORUM
            </Button>

            <Button
              color="inherit"
              onClick={handleNavigateToPlanner}
              style={{
                color: navbarFontColor,
                fontSize: "18px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              PLANNER
            </Button>
          </div>

          {/* Right Section (Profile Button) */}
          <div style={{ display: "flex", gap: "15px", textAlign: "right" }}>
            <Button
              color="inherit"
              onClick={handleNavigateToProfile}
              style={{
                color: navbarFontColor,
                fontFamily: "Poppins, sans-serif",
                border: "2px solid white",
                borderRadius: "10%",
                padding: "5px 10px",
                minWidth: "40px",
                height: "40px",
                fontSize: "14px",
              }}
            >
              PROFILE
            </Button>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              style={{
                color: "skyblue",
                fontFamily: "Poppins, sans-serif",
                padding: "5px 15px",
                borderRadius: "5px", // Rounded edges
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              LOGOUT
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      )}

      {/* First Section: Background Image */}
      <div
        ref = {backgroundRef}
        style={{
          backgroundImage: `url(${hkBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw",
          height: "60vh",
        }}
      >
      </div>

      {/*Picture and Details*/}
      <Container style={{height: '100vh', width: '100%', margin: '0 auto'}}>
        <Row style={{display: 'flex', marginTop: '1rem'}}>
          <Col style={{width: '60%', marginRight: '1rem'}}>
            {specificImage && (
              <div>
                {specificImage.secure_url && (
                  <img
                    src={specificImage.secure_url}
                    alt='Loading...'
                    style={{ width: '100%', height: 'auto', borderRadius: '5px'}}
                  />
                )}
              </div>
            )}
          </Col>
          <Col style={{width: '40%', height: 'auto', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', borderRadius: '10px'}}>
            <div className="tour_info">
              <h1 style={{marginTop: '0'}}>{location.name}</h1>
              <hr/>
              <div className="d-flex align-items-center gap-5">
                <h5 style={{textDecoration: 'underline', marginTop: '0'}}>Details</h5>
                  <FaMapMarkerAlt/>{location.address}
                  <p onClick={handleAddressClick} style={{cursor: 'pointer', color: 'blue', marginTop: '0'}}>View on Google Map</p>
              </div>
              <div className="tour_extra-details">
                <span>
                  <FaMoneyBillWave/>
                  ${location.price} /person
                </span>
              </div>
              <div>
                {location.type && location.type.map((type) => (
                  <div style={{ marginBottom: '0'}}>
                      <FaTag/>{type}
                      <br/>
                  </div>
                 ))}
              </div>
              <hr/>
              <h5 style={{textDecoration: 'underline', margin: '0'}}>Description</h5>
              {location.description ? (
                <p style={{marginTop: '0'}}>{location.description}</p>
              ) : (
                <p style={{marginTop: '0', color: 'grey'}}>No description available</p>
              )}
              <button
                className='addToCartBtn'
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </Col>
        </Row>
        <br />

        {/*Google Map*/}
        {showSidebar && (
          <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
            <div className="sidebar-content">
              <h1 style={{margin: '0'}}>{location.name}</h1>
              <h3 style={{margin: '0'}}>Google Map</h3>
              <p onClick={handleSidebarClose} style={{ cursor: 'pointer', color: 'blue', marginTop: '0'}}>Close</p>
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
        <Container style={{marginTop: '0.5rem'}}>
          {location._id && <CommentsSection locationId={location._id} />}
        </Container>

      </Container>
      <ChatbotFAB/>
    </section>
    </div>
  );
};

export default TourDetails;