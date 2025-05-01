import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import './shopping-cart.css'; // We'll define this CSS file next

const ShoppingCart = () => {
  // State for cart items: [{ site_id, startTime, endTime }]
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('shoppingCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // State for location details fetched based on site_id
  const [locations, setLocations] = useState({});

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch location details for each site_id in the cart
  useEffect(() => {
    const fetchLocationDetails = async () => {
      const locationData = {};
      for (const item of cartItems) {
        if (!locations[item.site_id]) {
          try {
            const response = await fetch(`http://localhost:3000/api/locations/${item.site_id}`);
            if (response.ok) {
              const data = await response.json();
              locationData[item.site_id] = data;
            }
          } catch (error) {
            console.error(`Error fetching location ${item.site_id}:`, error);
          }
        }
      }
      setLocations((prev) => ({ ...prev, ...locationData }));
    };

    if (cartItems.length > 0) {
      fetchLocationDetails();
    }
  }, [cartItems]);

  // Function to remove an item from the cart
  const removeFromCart = (site_id) => {
    const updatedCart = cartItems.filter((item) => item.site_id !== site_id);
    setCartItems(updatedCart);
    // Remove from locations state if no longer in cart
    const updatedLocations = { ...locations };
    delete updatedLocations[site_id];
    setLocations(updatedLocations);
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

  return (
    <section className="shopping-cart">
      <Container>
        <Row>
          {/* Saved Locations Column */}
          <Col lg="6">
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.site_id} className="cart-item">
                  <div className="location-details">
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
                    <Button
                      color="danger"
                      onClick={() => removeFromCart(item.site_id)}
                      style={{ marginTop: '10px' }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Col>

          {/* Timetable Column */}
          <Col lg="6">
            <h2>Weekly Timetable</h2>
            <div className="timetable">
              {timetableData.map((dayEntry, index) => (
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
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ShoppingCart;
