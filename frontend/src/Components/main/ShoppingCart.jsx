// /client/src/Components/ShoppingCart.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import './shoppingcart.css';

const ShoppingCart = () => {
  const navigate = useNavigate();

  // Helper function to get a consistent identifier from cart items.
  const getSiteId = (item) => item.site_id || item.id;

  // State for cart items: expected to be in the format [{ site_id, startTime, endTime }]
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error parsing shoppingCart from localStorage:', error);
      return [];
    }
  });

  // State for location details fetched based on site identifier
  const [locations, setLocations] = useState({});

  // A ref to track fetched site IDs to avoid duplicate API calls
  const fetchedSiteIds = useRef(new Set());

  // States for Google Map
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // Define Google Map container
  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch location details for each site in the cart that's missing from the state
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
                      const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_MAP_APIKEY}`);
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
              } else {
              console.error(`Failed to fetch location ${id}: ${response.status}`);
              }
          }
          } catch (error) {
            console.error(`Error fetching location ${id}:`, error);
          }
        }
      }
      console.log(locationData);

      if (hasNewFetches) {
        setLocations((prev) => ({ ...prev, ...locationData }));
      }
    };

    if (cartItems.length > 0) {
      fetchLocationDetails();
    }
  }, [cartItems, locations]);

  // Function to remove an item from the cart
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => getSiteId(item) !== id);
    setCartItems(updatedCart);
    // Remove location details from state if no longer in cart
    const updatedLocations = { ...locations };
    delete updatedLocations[id];
    setLocations(updatedLocations);
    // Remove the id from the fetched set to allow re-fetching if needed
    fetchedSiteIds.current.delete(id);
  };

  // Function to set the starting time for a cart item
  const setStartingTime = (id, time) => {
    const updatedCart = cartItems.map(item =>
      getSiteId(item) === id ? { ...item, startTime: time } : item
    );
    setCartItems(updatedCart);
  };

  // Function to set the ending time for a cart item
  const setEndingTime = (id, time) => {
    const updatedCart = cartItems.map(item =>
      getSiteId(item) === id ? { ...item, endTime: time } : item
    );
    setCartItems(updatedCart);
  };

  // Generate a simple weekly timetable based on the cart items
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const renderTimetable = () => {
    const timetable = daysOfWeek.map(day => ({
      day,
      events: [],
    }));

    cartItems.forEach((item) => {
      if (item.startTime && item.endTime) {
        const startDate = new Date(item.startTime);
        // Adjust so that Monday is index 0 and Sunday is index 6.
        const dayIndex = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1;
        const id = getSiteId(item);
        const locationName = (locations[id] && locations[id].name) || `Site ${id}`;
        timetable[dayIndex].events.push({
          location: locationName,
          start: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          end: new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    });
    return timetable;
  };

  const timetableData = renderTimetable();
  const hasEvents = timetableData.some(dayEntry => dayEntry.events.length > 0);

  // Handle 'google api already presented' error
    class LoadScriptOnlyIfNeeded extends LoadScript {
      componentDidMount() {
        const cleaningUp = true;
        const isBrowser = typeof document !== "undefined"; // require('@react-google-maps/api/src/utils/isbrowser')
        const isAlreadyLoaded =
          window.google &&
          window.google.maps &&
          document.querySelector("body.first-hit-completed"); // AJAX page loading system is adding this class the first time the app is loaded
        if (!isAlreadyLoaded && isBrowser) {
          // @ts-ignore
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

  return (
    <section className="shopping-cart-page">
      <Container>
        <h2 className="cart-header">Your Planner</h2>
        <div className="cart-flex-container">
          {/* Timetable Column (Left) */}
          <div className="timetable-col">
            <h3 className="sub-header">Weekly Timetable</h3>
            <div className="timetable">
              {hasEvents ? (
                timetableData.map((dayEntry, index) => (
                  <div key={index} className="day-entry">
                    <h4>{dayEntry.day}</h4>
                    {dayEntry.events.length > 0 ? (
                      dayEntry.events.map((event, idx) => (
                        <div key={idx} className="event">
                          <p>
                            {event.location}: {event.start} - {event.end}
                          </p>
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
          </div>

          {/* Cart Items Column (Right) */}
          <div className="cart-col">
            <h3 className="sub-header">Saved Locations</h3>
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
                        <p>{(locations[id] && locations[id].description) || 'Loading...'}</p>
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
            {Object.values(locations).map((location) => {
                if (location.lat && location.lng) {
                    return (
                        <MarkerF key={location.id} position={{ lat: location.lat, lng: location.lng }}/>
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