// /client/src/Components/main/TourDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Row, Col,
  Card, CardImg, CardBody, CardTitle, CardText,
  Button, Modal, ModalHeader, ModalBody,
  Spinner, Badge
} from 'reactstrap';
import { FaMapMarkerAlt, FaTag, FaMoneyBillWave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import {jwtDecode} from 'jwt-decode';
import CommentsSection from './CommentsSection';
import './tour-details.css';

const containerStyle = { width: '100%', height: '100%' };

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);

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

  const toggleMap = () => setShowMap(!showMap);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    if (!cart.find(item => item.id === location._id)) {
      cart.push({
        id: location._id,
        name: location.name,
        price: location.price
      });
      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    if (window.confirm('Added to planner. Go to planner now?')) {
      navigate('/planner');
    }
  };

  if (loadingLoc) {
    return (
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner color="primary" />
      </Container>
    );
  }
  if (error || !location) {
    return (
      <Container className="py-5">
        <p className="text-danger">{error || 'No details found.'}</p>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="tour-details-container py-4">
        <Row>
          {/* LEFT: Image & Info */}
          <Col xs="12" md="7" className="mb-4">
            <Card>
              {loadingImage ? (
                <Spinner className="m-5" />
              ) : (
                <CardImg
                  top
                  width="100%"
                  src={imageUrl || '/default-tour.jpg'}
                  alt={location.name}
                />
              )}
              <CardBody>
                <CardTitle tag="h3">{location.name}</CardTitle>
                <div className="d-flex flex-wrap align-items-center mb-2">
                  <FaMapMarkerAlt className="me-2" />
                  <Button color="link" onClick={toggleMap} className="p-0">
                    {location.address}
                  </Button>
                </div>
                <div className="tour-meta mb-3">
                  <Badge color="success" className="me-2">
                    <FaMoneyBillWave /> ${location.price}/person
                  </Badge>
                  {location.type?.map((t, i) => (
                    <Badge key={i} color="info" className="me-1">
                      <FaTag /> {t}
                    </Badge>
                  ))}
                </div>
                <CardText>
                  <strong>Description:</strong>{' '}
                  {location.description || 'No description available.'}
                </CardText>
                <Button color="primary" block onClick={handleAddToCart}>
                  Add to Planner
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* RIGHT: Comments */}
          <Col xs="12" md="5">
            <CommentsSection locationId={location._id} />
          </Col>
        </Row>
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
    </>
  );
};

export default TourDetails;