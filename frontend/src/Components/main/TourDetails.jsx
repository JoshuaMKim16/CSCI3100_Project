// /client/src/Components/main/TourDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import {jwtDecode} from 'jwt-decode';
import CommentsSection from './CommentsSection';
import './tour-details.css';

const containerStyle = { width: '100%', height: '100%' };

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [error, setError] = useState('');

  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isGeocoded, setIsGeocoded] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);

  // derive cart key from JWT
  const getCartKey = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      if (stored.token) {
        const decoded = jwtDecode(stored.token);
        const uid = decoded.id || decoded.userId;
        return `shoppingCart_${uid}`;
      }
    } catch {}
    return 'shoppingCart_guest';
  };
  const cartKey = getCartKey();

  // Fetch location
  useEffect(() => {
    setLoadingLoc(true);
    fetch(`http://localhost:3000/api/locations/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => setLocation(data))
      .catch(() => setError('Unable to load tour details.'))
      .finally(() => setLoadingLoc(false));
  }, [id]);

  // Fetch specific image
  useEffect(() => {
    if (!location?.picture?.length) return;
    setLoadingImage(true);
    const filename = location.picture[0]
      .split('/')
      .pop()
      .split('.')[0];
    fetch(`http://localhost:3000/api/photos/${filename}`)
      .then(res => {
        if (!res.ok) throw new Error('Image fetch failed');
        return res.json();
      })
      .then(json => setImageUrl(json.secure_url))
      .catch(console.error)
      .finally(() => setLoadingImage(false));
  }, [location]);

  // Geocode address
  useEffect(() => {
    if (!location?.address) return;
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location.address
      )}&key=${process.env.REACT_APP_MAP_APIKEY}`
    )
      .then(res => res.json())
      .then(jd => {
        if (jd.status === 'OK') {
          const { lat, lng } = jd.results[0].geometry.location;
          setMapCenter({ lat, lng });
          setIsGeocoded(true);
        }
      })
      .catch(console.error);
  }, [location]);

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
      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    if (window.confirm('Added to planner. Go to planner now?')) {
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
                <CardImg
                  top
                  width="100%"
                  src={imageUrl || '/default-tour.jpg'}
                  alt={location.name}
                />
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

      {/* Full-screen Modal for Map */}
      <Modal
        isOpen={showMap}
        toggle={toggleMap}
        className="map-modal"
        fade={false}
        centered
      >
        <ModalHeader toggle={toggleMap}>Location Map</ModalHeader>
        <ModalBody className="p-0">
          {isGeocoded ? (
            <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_APIKEY}>
              <GoogleMap
                ref={mapRef}
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
              >
                <MarkerF position={mapCenter} />
              </GoogleMap>
            </LoadScript>
          ) : (
            <div className="h-100 d-flex justify-content-center align-items-center">
              <Spinner />
            </div>
          )}
        </ModalBody>
      </Modal>
    </section>
  );
};

export default TourDetails;