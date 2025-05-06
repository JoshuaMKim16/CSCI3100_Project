import React, { useState, useEffect, useRef } from 'react';
import { Container, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Button as MuiButton } from '@mui/material';
import Box from '@mui/material/Box';
import hkBackground from './hk_background.png'; // Fallback image
import './shoppingcart.css';
import ChatbotFAB from "../utils/AIChatbot";

const ShoppingCart = () => {
  const navigate = useNavigate();

  // Decode JWT from the user object stored in localStorage (if it exists)
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
    localStorage.removeItem('user'); // Clear user data
    navigate('/login'); // Redirect to login page
  };

  const userId = getCurrentUserIdFromJWT();
  const cartKey = `shoppingCart_${userId}`;
  const getSiteId = (item) => item.site_id || item.id;

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(cartKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error parsing shoppingCart from localStorage:', error);
      return [];
    }
  });

  const [locations, setLocations] = useState({});
  const [specificImages, setSpecificImages] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const fetchedSiteIds = useRef(new Set());
  const fetchedImageIds = useRef(new Set());

  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      const locationData = {};
      let hasNewFetches = false;

      for (const item of cartItems) {
        const id = getSiteId(item);
        if (!fetchedSiteIds.current.has(id) && !locations[id]) {
          try {
            const response = await fetch(`http://localhost:3000/api/locations/${id}`);
            if (response.ok) {
              const data = await response.json();
              locationData[id] = data;
              fetchedSiteIds.current.add(id);
              hasNewFetches = true;

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
      }

      if (hasNewFetches) {
        console.log('Locations state updated:', locationData);
        setLocations((prev) => ({ ...prev, ...locationData }));
      }
    };

    if (cartItems.length > 0) {
      fetchLocationDetails();
    }
  }, [cartItems]);

  useEffect(() => {
    const fetchSpecificImage = async (id, pictureUrl) => {
      if (fetchedImageIds.current.has(id)) {
        console.log(`Image for location ${id} already fetched, skipping.`);
        return;
      }

      setImageLoading((prev) => ({ ...prev, [id]: true }));
      try {
        // If no picture URL, use fallback
        if (!pictureUrl) {
          console.warn(`No picture URL for location ${id}, using fallback image.`);
          setSpecificImages((prev) => ({
            ...prev,
            [id]: { url: hkBackground },
          }));
          fetchedImageIds.current.add(id);
          return;
        }

        const filename = pictureUrl.split('/').pop().split('.')[0];
        console.log(`Fetching image for location ${id}, filename: ${filename}`);
        const response = await fetch(`http://localhost:3000/api/photos/${filename}`);
        if (!response.ok) {
          throw new Error(`Fetching image for ${filename} failed with status ${response.status}`);
        }
        const data = await response.json();
        // Handle various API response formats
        const imageUrl = data.secure_url || data.url || data.image_url || hkBackground;
        console.log(`Image fetched for location ${id}: ${imageUrl}`);
        setSpecificImages((prev) => ({
          ...prev,
          [id]: { url: imageUrl },
        }));
        fetchedImageIds.current.add(id);
      } catch (err) {
        console.error(`Error fetching image for location ${id}:`, err);
        setSpecificImages((prev) => ({
          ...prev,
          [id]: { url: hkBackground },
        }));
        fetchedImageIds.current.add(id);
      } finally {
        setImageLoading((prev) => ({ ...prev, [id]: false }));
      }
    };

    // Initialize specificImages with fallback for all locations
    const initialImages = {};
    Object.keys(locations).forEach((id) => {
      if (!specificImages[id]) {
        initialImages[id] = { url: hkBackground };
      }
    });
    setSpecificImages((prev) => ({ ...prev, ...initialImages }));

    // Fetch images for locations with pictures
    Object.keys(locations).forEach((id) => {
      const picture = Array.isArray(locations[id]?.picture)
        ? locations[id].picture[0]
        : typeof locations[id]?.picture === 'string'
        ? locations[id].picture
        : null;
      console.log(`Checking image for location ${id}, picture: ${picture}`);
      fetchSpecificImage(id, picture);
    });
    console.log('Specific images state:', specificImages);
  }, [locations, specificImages]);

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

  const setStartingTime = (id, time) => {
    const updatedCart = cartItems.map((item) =>
      getSiteId(item) === id ? { ...item, startTime: time } : item
    );
    setCartItems(updatedCart);
  };

  const setEndingTime = (id, time) => {
    const updatedCart = cartItems.map((item) =>
      getSiteId(item) === id ? { ...item, endTime: time } : item
    );
    setCartItems(updatedCart);
  };

  const handleImageError = (e, id) => {
    console.error(`Image failed to load for location ${id}: ${e.target.src}`);
    // Fallback to a known good public image for testing
    e.target.src = 'https://via.placeholder.com/150?text=Fallback';
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const renderTimetable = () => {
    try {
      const timetable = daysOfWeek.map((day) => ({
        day,
        events: [],
      }));

      cartItems.forEach((item) => {
        if (item.startTime && item.endTime) {
          const startDate = new Date(item.startTime);
          const dayIndex = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1;
          const id = getSiteId(item);
          const locationName = (locations[id] && locations[id].name) || `Site ${id}`;
          const locationImage = specificImages[id]?.url || hkBackground;
          console.log(`Rendering timetable for location ${id}, image: ${locationImage}`);
          const locationTypes = (locations[id] && locations[id].type) || [];
          const isRestaurantOrCafe = locationTypes.some((type) =>
            ['restaurant', 'cafe'].includes(type.toLowerCase())
          );
          const bgClass = isRestaurantOrCafe ? 'bg-creamy-peach' : 'bg-creamy-mint';

          timetable[dayIndex].events.push({
            startDate,
            location: locationName,
            start: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            bgClass,
            image: locationImage,
          });
        }
      });

      timetable.forEach((dayEntry) => {
        dayEntry.events.sort((a, b) => a.startDate - b.startDate);
      });

      return timetable;
    } catch (error) {
      console.error('Error rendering timetable:', error);
      return daysOfWeek.map((day) => ({ day, events: [] }));
    }
  };

  const timetableData = renderTimetable();
  const hasEvents = timetableData.some((dayEntry) => dayEntry.events.length > 0);

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

  class LoadScriptOnlyIfNeeded extends LoadScript {
    componentDidMount() {
      const cleaningUp = true;
      const isBrowser = typeof document !== 'undefined';
      const isAlreadyLoaded =
        window.google && window.google.maps && document.querySelector('body.first-hit-completed');
      if (!isAlreadyLoaded && isBrowser) {
        if (window.google && !cleaningUp) {
          console.error('Google API is already loaded');
          return;
        }
        this.isCleaningUp().then(this.injectScript);
      }
      if (isAlreadyLoaded) {
        this.setState({ loaded: true });
      }
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#fdfcfc' }}>
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: 'transparent', boxShadow: 'none', zIndex: 1300 }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <Box sx={{ display: 'flex', gap: '20px', textAlign: 'left' }}>
            <MuiButton
              color="inherit"
              sx={{ color: 'black', fontSize: '18px', fontFamily: 'Poppins, sans-serif' }}
            >
              LOGO
            </MuiButton>
          </Box>
          <Box
            sx={{
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
          </Box>
          <Box sx={{ display: 'flex', gap: '15px', textAlign: 'right' }}>
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
          </Box>
        </Toolbar>
      </AppBar>
      <section className="shopping-cart-page" style={{ marginTop: '80px' }}>
        <Container>
          <div className="cart-flex-container">
            {/* Timetable Column */}
            <div className="timetable-col">
              <h3 className="sub-header"></h3>
              <div className="timetable">
                {hasEvents ? (
                  timetableData.map((dayEntry, index) => (
                    <div key={index} className="day-entry">
                      <h4>{dayEntry.day}</h4>
                      {dayEntry.events.length > 0 ? (
                        dayEntry.events.map((event, idx) => (
                          <div key={idx} className="event">
                            <div className={`event-entry ${event.bgClass}`}>
                              {imageLoading[getSiteId(cartItems[idx])] ? (
                                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  Loading image...
                                </div>
                              ) : (
                                <img
                                  src={event.image}
                                  alt={event.location}
                                  onError={(e) => handleImageError(e, getSiteId(cartItems[idx]))}
                                />
                              )}
                              <div className="event-content">
                                <span className="location location-banner">
                                  {event.location}
                                </span>
                                <span className="time">
                                  {event.start} - {event.end}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No events scheduled.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-timetable">
                    <p>No events scheduled for this week.</p>
                  </div>
                )}
              </div>
              <Button color="success" onClick={handleExportExcel} className="mb-3">
                Export Timetable to Excel
              </Button>
            </div>
            {/* Cart Items Column (Right) */}
            <div className="cart-col">
              <h3 className="sub-header"></h3>
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
        <LoadScriptOnlyIfNeeded googleMapsApiKey={process.env.REACT_APP_MAP_APIKEY} libraries={['marker']}>
          {isMapLoaded && (
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
          )}
        </LoadScriptOnlyIfNeeded>
      </section>
      <ChatbotFAB />
    </div>
  );
};

export default ShoppingCart;