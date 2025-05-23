import React, { useState, useEffect, useRef } from 'react';
import { Container, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, MarkerF } from '@react-google-maps/api';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Button as MuiButton } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './shoppingcart.css';
import ChatbotFAB from "../utils/AIChatbot";
import fallbackImage from "./hk_background2.jpg";
import fallbackImage1 from "./hk_background1.jpg";

// Simple throttle function to limit scroll event frequency
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// General Planner logic
const ShoppingCart = () => {
  const navigate = useNavigate();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Decode JWT from the user object stored in localStorage
  const getCurrentUserIdFromJWT = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.token) {
          const decodedToken = jwtDecode(parsedData.token);
          return decodedToken.id || decodedToken.userId;
        }
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
    return 'guest';
  };

  // Navigation handlers
  const handleNavigateToPlanner = () => {
    navigate('/planner');
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userId = getCurrentUserIdFromJWT();
  const cartKey = `shoppingCart_${userId}`;
  // Updated getSiteId to prioritize _id for compatibility with TourDetails.jsx
  const getSiteId = (item) => item._id || item.id || item.site_id;

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(cartKey);
      // Ensure cart items have startTime and endTime initialized
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return parsedCart.map(item => ({
        ...item,
        startTime: item.startTime || '',
        endTime: item.endTime || ''
      }));
    } catch (error) {
      console.error('Error parsing shoppingCart from localStorage:', error);
      return [];
    }
  });

  const [locations, setLocations] = useState({});
  const [specificImages, setSpecificImages] = useState({});
  const fetchedSiteIds = useRef(new Set());
  const fetchedImageIds = useRef(new Set());

  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const mapRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  // Save/update cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  // Fetch location details when component mounts and when there are cart items
  useEffect(() => {
    const fetchLocationDetails = async () => {
      const locationData = {};
      let hasNewFetches = false;

      // Fetch details for cart items loaded from localStorage
      const itemsToFetch = cartItems.filter(
        (item) => !fetchedSiteIds.current.has(getSiteId(item)) && !locations[getSiteId(item)]
      );

      for (const item of itemsToFetch) {
        const id = getSiteId(item);
        try {
          const response = await fetch(`http://localhost:3000/api/locations/${id}`);
          if (response.ok) {
            const data = await response.json();
            locationData[id] = data;
            fetchedSiteIds.current.add(id);
            hasNewFetches = true;

            // For Google Map API handling
            const address = data.address;
            if (address) {
              try {
                const geocodeResponse = await fetch(
                  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    address
                  )}&key=${process.env.REACT_APP_MAP_APIKEY}`
                );
                const geocodeData = await geocodeResponse.json();
                if (geocodeData.status === 'OK') {
                  const { lat, lng } = geocodeData.results[0].geometry.location;
                  locationData[id].lat = lat;
                  locationData[id].lng = lng;
                  setIsMapLoaded(true);
                  // Set the map center to the first valid location
                  if (Object.keys(locationData).length === 1) {
                    setMapCenter({ lat, lng });
                  }
                } else {
                  console.error(`Geocoding failed for address ${address}: ${geocodeData.status}`);
                }
              } catch (geocodeError) {
                console.error(`Error fetching geocoding data for address ${address}:`, geocodeError);
              }
            }
          } else {
            console.error(`Failed to fetch location ${id}: ${response.status}`);
          }
        } catch (error) {
          console.error(`Error fetching location ${id}:`, error);
        }
      }

      if (hasNewFetches) {
        setLocations((prev) => ({ ...prev, ...locationData }));
      }
    };

    if (cartItems.length > 0) {
      fetchLocationDetails();
    }
  }, []);

  // Fetch specific images for locations
  useEffect(() => {
    const fetchSpecificImage = async (id, pictureUrl) => {
      if (!pictureUrl || fetchedImageIds.current.has(id)) return;

      try {
        const filename = pictureUrl.split('/').pop().split('.')[0];
        const response = await fetch(`http://localhost:3000/api/photos/${filename}`);
        if (!response.ok) {
          throw new Error('Fetching specific image failed');
        }
        const data = await response.json();
        setSpecificImages((prev) => ({
          ...prev,
          [id]: data.secure_url,
        }));
        fetchedImageIds.current.add(id);
      } catch (err) {
        console.error('Error fetching specific image:', err);
      }
    };

    Object.keys(locations).forEach((id) => {
      const picture = locations[id]?.picture?.[0];
      if (picture) {
        fetchSpecificImage(id, picture);
      }
    });
  }, [locations]);

  // Remove the location from the planner
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => getSiteId(item) !== id);
    setCartItems(updatedCart);
    const updatedLocations = { ...locations };
    delete updatedLocations[id];
    setLocations(updatedLocations);
    const updatedImages = { ...specificImages };
    delete updatedImages[id];
    setSpecificImages(updatedImages);
    fetchedSiteIds.current.delete(id);
    fetchedImageIds.current.delete(id);
  };

  // Setting the starting time
  const setStartingTime = (id, time) => {
    const updatedCart = cartItems.map((item) =>
      getSiteId(item) === id ? { ...item, startTime: time } : item
    );
    setCartItems(updatedCart);
  };

  // Setting the ending time
  const setEndingTime = (id, time) => {
    const updatedCart = cartItems.map((item) =>
      getSiteId(item) === id ? { ...item, endTime: time } : item
    );
    setCartItems(updatedCart);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Timetable rendering functions
  const renderTimetable = () => {
    const timetable = daysOfWeek.map((day) => ({
      day,
      events: [],
    }));

    cartItems.forEach((item) => {
      if (item.startTime && item.endTime) {
        const startDate = new Date(item.startTime);
        // Adjust day index: JS getDay() gives 0 for Sunday
        const dayIndex = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1;
        const id = getSiteId(item);
        const locationName = (locations[id] && locations[id].name) || `Site ${id}`;
        const locationImage = specificImages[id] || '';
        const locationTypes = (locations[id] && locations[id].type) || [];
        const isRestaurantOrCafe = locationTypes.some((type) =>
          ['restaurant', 'cafe'].includes(type.toLowerCase())
        );
        const bgClass = isRestaurantOrCafe ? 'bg-creamy-peach' : 'bg-creamy-mint';

        timetable[dayIndex].events.push({
          startDate,
          location: locationName,
          start: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          end: new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          bgClass,
          image: locationImage,
        });
      }
    });

    timetable.forEach((dayEntry) => {
      dayEntry.events.sort((a, b) => a.startDate - b.startDate);
    });

    return timetable;
  };

  const timetableData = renderTimetable();
  const hasEvents = timetableData.some((dayEntry) => dayEntry.events.length > 0);
  const googleMapsLibraries = ['places'];

  // Export to Excel handling function
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Timetable');
    worksheet.columns = [
      { header: 'Day', key: 'day', width: 15 },
      { header: 'Location', key: 'location', width: 30 },
      { header: 'Start Time', key: 'start', width: 15 },
      { header: 'End Time', key: 'end', width: 15 },
    ];
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC00' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    timetableData.forEach((dayEntry) => {
      dayEntry.events.forEach((event) => {
        worksheet.addRow({
          day: dayEntry.day,
          location: event.location,
          start: event.start,
          end: event.end,
        });
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'timetable.xlsx');
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      try {
        const currentScrollPos = window.pageYOffset;
        setIsNavbarVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
      } catch (error) {
        console.error('Error in scroll handler:', error);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  // Use the useJsApiLoader hook to load the Google Maps API only once - prevent unnecessary, multiple API calls
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAP_APIKEY,
    libraries: googleMapsLibraries,
  });

  return (
    <div
      style={{
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      
      {/* Navbar Settings */}
      <AppBar
        position="fixed"
        style={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Toolbar
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', gap: '20px', textAlign: 'left' }}>
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                fontFamily: '"Dancing Script", cursive',
                fontSize: '32px',
                color: 'black',
                zIndex: 2,
              }}
            >
              TravelTailor
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              gap: '30px',
              textAlign: 'center',
            }}
          >
            <MuiButton
              color="inherit"
              onClick={() => navigate('/main')}
              sx={{ color: 'black', fontSize: '18px', fontFamily: 'Poppins, sans-serif' }}
            >
              HOME
            </MuiButton>
            <MuiButton
              color="inherit"
              onClick={() => navigate('/tour')}
              sx={{ color: 'black', fontSize: '18px', fontFamily: 'Poppins, sans-serif' }}
            >
              TOUR
            </MuiButton>
            <MuiButton
              color="inherit"
              onClick={() => navigate('/forum')}
              sx={{ color: 'black', fontSize: '18px', fontFamily: 'Poppins, sans-serif' }}
            >
              FORUM
            </MuiButton>
            <MuiButton
              color="inherit"
              onClick={handleNavigateToPlanner}
              sx={{ color: 'black', fontSize: '18px', fontFamily: 'Poppins, sans-serif' }}
            >
              PLANNER
            </MuiButton>
          </div>
          <div style={{ display: 'flex', gap: '15px', textAlign: 'right' }}>
            <MuiButton
              color="inherit"
              onClick={handleNavigateToProfile}
              sx={{
                color: 'black',
                fontFamily: 'Poppins, sans-serif',
                border: '2px solid white',
                borderRadius: '10%',
                padding: '5px 10px',
                minWidth: '40px',
                height: '40px',
                fontSize: '14px',
              }}
            >
              PROFILE
            </MuiButton>
            <MuiButton
              onClick={handleLogout}
              sx={{
                color: 'skyblue',
                fontFamily: 'Poppins, sans-serif',
                padding: '5px 15px',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              LOGOUT
            </MuiButton>
          </div>
        </Toolbar>
      </AppBar>
      <div
        style={{
          backgroundImage: `url(${fallbackImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100vw',
          height: '45vh',
          position: 'relative',
        }}
      >
        <Container
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            color: 'white',
            textAlign: 'right',
            paddingBottom: '20px',
            paddingRight: '20px',
          }}
        >
          <Typography
            variant="h4"
            style={{
              color: 'white',
              textAlign: 'right',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 'bold',
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
            }}
          >
            Explore Your Shopping Cart
          </Typography>
        </Container>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '45vh',
          left: 0,
          width: '100vw',
          height: 'calc(100% - 45vh)',
          backgroundImage: `url(${fallbackImage1})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 1,
        }}
      />
      {/* Shopping cart settings */}
      <section
        className="shopping-cart-page"
        style={{
          marginTop: '0px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Container>
          <div className="cart-flex-container" style={{ gap: '0.5rem' }}>
            <div className="timetable-col">
              <h3 className="sub-header"></h3>
              <Button
                color="success"
                onClick={handleExportExcel}
                className="mb-3"
                style={{
                  display: 'inline-block',
                  width: 'fit-content',
                  padding: '4px 8px',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#000000',
                  backgroundColor: 'transparent',
                  border: '1px solid #000000',
                  borderRadius: '5px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
                onMouseOver={(e) => (e.target.style.color = '#61dafb')}
                onMouseOut={(e) => (e.target.style.color = '#000000')}
              >
                Export Timetable to Excel
              </Button>
              <div className="timetable">
                {hasEvents ? (
                  timetableData.map((dayEntry, index) => (
                    <div key={index} className="day-entry">
                      <h4>{dayEntry.day}</h4>
                      {dayEntry.events.length > 0 ? (
                        dayEntry.events.map((event, idx) => (
                          <div key={idx} className="event">
                            <div className={`event-entry ${event.bgClass}`} style={{ display: 'flex', alignItems: 'flex-start' }}>
                              {event.image && (
                                <img
                                  src={event.image}
                                  alt={event.location}
                                  style={{ marginRight: '10px', width: '50px', height: '50px', objectFit: 'cover' }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              <div
                                className="event-content"
                                style={{
                                  display: 'block',
                                  justifyContent: 'flex-start',
                                }}
                              >
                                <span
                                  className="location location-banner"
                                  style={{
                                    background: 'transparent',
                                    margin: 0,
                                    padding: 0,
                                    display: 'block',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {event.location}
                                </span>
                                <span
                                  className="time"
                                  style={{
                                    margin: 0,
                                    padding: 0,
                                    display: 'block',
                                  }}
                                >
                                  {event.start} - {event.end}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No events scheduled for this day.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-timetable">
                    <p>No events scheduled for this week.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="timetable-col">
              <h3 className="sub-header"></h3>
              <Button
                tag={Link}
                to="/searchpage"
                className="mb-3"
                style={{
                  display: 'inline-block',
                  width: 'fit-content',
                  padding: '4px 8px',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#000000',
                  backgroundColor: 'transparent',
                  border: '1px solid #000000',
                  borderRadius: '5px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => (e.target.style.color = '#61dafb')}
                onMouseOut={(e) => (e.target.style.color = '#000000')}
              >
                Add More Items
              </Button>
              {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                  <p className="empty-cart">Your cart is empty.</p>
                  <Link to="/searchpage">
                    <button className="add-items-button">Add Items from Search</button>
                  </Link>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => {
                    const id = getSiteId(item);
                    return (
                      <div key={id} className="cart-item">
                        <div className="cart-details">
                          <h3>{(locations[id] && locations[id].name) || `Site ${id}`}</h3>
                          <p className="cart-description">
                            {locations[id]?.description || 'No description available'}
                          </p>
                          <div className="time-inputs">
                            <label>
                              Start Time:
                              <input
                                type="datetime-local"
                                value={item.startTime || ''}
                                onChange={(e) => setStartingTime(id, e.target.value)}
                              />
                            </label>
                            <label>
                              End Time:
                              <input
                                type="datetime-local"
                                value={item.endTime || ''}
                                onChange={(e) => setEndingTime(id, e.target.value)}
                              />
                            </label>
                          </div>
                          <div className="cart-buttons">
                            <Button color="danger" onClick={() => removeFromCart(id)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Google Map settings */}
      <section className="map-section">
        {loadError && <div>Error loading map</div>}
        {isLoaded ? (
          <GoogleMap ref={mapRef} mapContainerStyle={containerStyle} center={mapCenter} zoom={16}>
            {Object.values(locations).map((locationItem) => {
              if (locationItem.lat && locationItem.lng) {
                return (
                  <MarkerF
                    key={locationItem.id || locationItem._id}
                    position={{ lat: locationItem.lat, lng: locationItem.lng }}
                  />
                );
              }
              return null;
            })}
          </GoogleMap>
        ) : (
          <div>Loading map...</div>
        )}
      </section>
      <ChatbotFAB />
    </div>
  );
};

export default ShoppingCart;