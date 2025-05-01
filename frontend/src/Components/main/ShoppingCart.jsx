import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './shoppingcart.css';

const ShoppingCart = () => {
  // State for cart items: [{ site_id, startTime, endTime }]
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error parsing shoppingCart from localStorage:', error);
      return [];
    }
  });

  // State for location details fetched based on site_id
  const [locations, setLocations] = useState({});

  // Ref to track fetched site_ids
  const fetchedSiteIds = useRef(new Set());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch location details for each site_id in the cart
  useEffect(() => {
    const fetchLocationDetails = async () => {
      const locationData = {};
      let hasNewFetches = false;

      for (const item of cartItems) {
        if (!fetchedSiteIds.current.has(item.site_id) && !locations[item.site_id]) {
          try {
            const response = await fetch(`http://localhost:3000/api/locations/${item.site_id}`);
            if (response.ok) {
              const data = await response.json();
              locationData[item.site_id] = data;
              fetchedSiteIds.current.add(item.site_id);
              hasNewFetches = true;
            } else {
              console.error(`Failed to fetch location ${item.site_id}: ${response.status}`);
            }
          } catch (error) {
            console.error(`Error fetching location ${item.site_id}:`, error);
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
  }, [cartItems, locations]);

  // Function to remove an item from the cart
  const removeFromCart = (site_id) => {
    const updatedCart = cartItems.filter((item) => item.site_id !== site_id);
    setCartItems(updatedCart);
    // Remove from locations state if no longer in cart
    const updatedLocations = { ...locations };
    delete updatedLocations[site_id];
    setLocations(updatedLocations);
    // Remove from fetchedSiteIds to allow re-fetching if needed
    fetchedSiteIds.current.delete(site_id);
  };

  // Function to set the starting time for a cart item
  const setStartingTime = (site_id, time) => {
    const updatedCart = cartItems.map((item) =>
      item.site_id === site_id ? { ...item, startTime: time } : item
    );
    setCartItems(updatedCart);
  };

  // Function to set the ending time for a cart item
  const setEndingTime = (site_id, time) => {
    const updatedCart = cartItems.map((item) =>
      item.site_id === site_id ? { ...item, endTime: time } : item
    );
    setCartItems(updatedCart);
  };

  // Generate a simple weekly timetable
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const renderTimetable = () => {
    const timetable = daysOfWeek.map((day) => ({
      day,
      events: [],
    }));

    cartItems.forEach((item) => {
      if (item.startTime && item.endTime) {
        const startDate = new Date(item.startTime);
        const dayIndex = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1; // Adjust Sunday to last
        const locationName = locations[item.site_id]?.name || `Site ${item.site_id}`;
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
  const hasEvents = timetableData.some((dayEntry) => dayEntry.events.length > 0);

  return (
    <section className="shopping-cart-page">
      <Container>
        <Row>
          {/* Timetable Column (Left) */}
          <Col lg="6">
            <h2 className="cart-header">Weekly Timetable</h2>
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
          </Col>

          {/* Saved Locations Column (Right) */}
          <Col lg="6">
            <h2 className="cart-header">Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
              <div className="empty-cart-container">
                <p className="empty-cart">Your cart is empty.</p>
                <Link to="/searchpage">
                  <button className="add-items-button">Add Items from Search</button>
                </Link>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.site_id} className="cart-item">
                    <div className="cart-details">
                      <h3>{locations[item.site_id]?.name || `Site ${item.site_id}`}</h3>
                      <p>{locations[item.site_id]?.description || 'Loading...'}</p>
                      <div className="time-inputs">
                        <label>
                          Start Time:
                          <input
                            type="datetime-local"
                            value={item.startTime || ''}
                            onChange={(e) => setStartingTime(item.site_id, e.target.value)}
                          />
                        </label>
                        <label>
                          End Time:
                          <input
                            type="datetime-local"
                            value={item.endTime || ''}
                            onChange={(e) => setEndingTime(item.site_id, e.target.value)}
                          />
                        </label>
                      </div>
                      <div className="cart-buttons">
                        <Button
                          color="danger"
                          onClick={() => removeFromCart(item.site_id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ShoppingCart;