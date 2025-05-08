import React, { useState, useEffect, useRef } from 'react';
import { Container, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';
import './shoppingcart.css';

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
          // Adjust based on your JWT payload structure (e.g., id or userId)
          return decodedToken.id || decodedToken.userId;
        }
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
    return 'guest';
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

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const savedCart = localStorage.getItem(cartKey);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } catch (err) {
        console.error(err);
      }
    };
  }, [cartKey]);

  const [locations, setLocations] = useState({});
  // State for fetched images
  const [specificImages, setSpecificImages] = useState({});

  // A ref to track fetched site IDs to avoid duplicate API calls
  const fetchedSiteIds = useRef(new Set());
  const fetchedImageIds = useRef(new Set());

  // States for Google Map.
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // Define Google Map container style.
  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  // Save the cart to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  // Fetch location details for each site in the cart
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
        setLocations((prev) => ({ ...prev, ...locationData }));
      }
    };

    if (cartItems.length > 0) {
      fetchLocationDetails();
    }
  }, [cartItems]);

  // Fetch specific images for locations with pictures
  useEffect(() => {
    const fetchSpecificImage = async (id, pictureUrl) => {
      if (!pictureUrl || fetchedImageIds.current.has(id)) return;

      try {
        const filename = pictureUrl.split('/').pop().split('.')[0];
        const response = await fetch(`http://localhost:3000/api/photos/${filename}`);
        if (!response.ok) {
          throw new Error(`Fetching image for ${filename} failed`);
        }
        const data = await response.json();
        setSpecificImages((prev) => ({
          ...prev,
          [id]: data, // Assume data contains { url: "image_url" }
        }));
        fetchedImageIds.current.add(id);
      } catch (err) {
        console.error(`Error fetching image for ${id}:`, err);
      }
    };

    Object.keys(locations).forEach((id) => {
      const picture = locations[id]?.picture?.[0];
      if (picture) {
        fetchSpecificImage(id, picture);
      }
    });
  }, [locations]);

  // Function to remove an item from the cart.
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

  // Function to set the starting time for a cart item.
  const setStartingTime = (id, time) => {
    const updatedCart = cartItems.map((item) =>
      getSiteId(item) === id ? { ...item, startTime: time } : item
    );
    setCartItems(updatedCart);
  };

  // Function to set the ending time for a cart item.
  const setEndingTime = (id, time) => {
    const updatedCart = cartItems.map((item) =>
      getSiteId(item) === id ? { ...item, endTime: time } : item
    );
    setCartItems(updatedCart);
  };

  // Generate a weekly timetable with events sorted chronologically within each day
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const renderTimetable = () => {
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
        const locationImage = specificImages[id]?.url || '';
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

    // Sort events within each day by startDate
    timetable.forEach((dayEntry) => {
      dayEntry.events.sort((a, b) => a.startDate - b.startDate);
    });

    return timetable;
  };

  const timetableData = renderTimetable();
  const hasEvents = timetableData.some((dayEntry) => dayEntry.events.length > 0);

  // Function to export the timetable to Excel
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
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
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
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'timetable.xlsx');
  };

  class LoadScriptOnlyIfNeeded extends LoadScript {
    componentDidMount() {
      const cleaningUp = true;
      const isBrowser = typeof document !== 'undefined';
      const isAlreadyLoaded = window.google && window.google.maps && document.querySelector('body.first-hit-completed');
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
    <section className="shopping-cart-page">
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
                          <div className="event-entry">
                            {event.image && <img src={event.image} alt={event.location} />}
                            <div className="event-content">
                              <span className={`location ${event.bgClass}`}>{event.location}</span>
                              <span className="time">{event.start} - {event.end}</span>
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
                        <p className="cart-description">{locations[id]?.description || 'No description available'}</p>
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
                  <MarkerF key={locationItem.id || locationItem._id} position={{ lat: locationItem.lat, lng: locationItem.lng }} />
                );
              }
              return null;
            })}
          </GoogleMap>
        )}
      </LoadScriptOnlyIfNeeded>
    </section>
  );
};

export default ShoppingCart;