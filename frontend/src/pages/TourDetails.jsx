import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Form, ListGroup, Button} from 'reactstrap';
import {useParams} from 'react-router-dom'
import {useNavigate, Link} from 'react-router-dom'
import '../styles/tour-details.css'; // Reuse the existing styles
import Booking from '../components/Booking/Booking'

const TourDetails = () => {
  const {id} = useParams();
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  // Fetch locations from the backend
  const fetchLocationByID = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/locations/${id}`);
      console.log(response);
      if(!response.ok){
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      };
      const data = await response.json();
      console.log(data);
      setLocation(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to load location details.');
    }}

    useEffect(() => {
        if(id){
            fetchLocationByID(id);
        }
    }, [id]);

    // Fetch locations from the backend
      useEffect(() => {
        const loadImage = async () => {
          try {
            const imageModule = await import(`../assets/site_data/${location.picture}`);
            setImageSrc(imageModule.default);
          } catch (error) {
            console.error('Error loading the image:', error);
          }
        };
        loadImage();
      });
    
    // When click Add to Planner button 
    const navigate = useNavigate()
    
    const handleClick = e => {
      e.preventDefault()
      navigate('/thank-you')
    }

    return (
      <section>
        <Container>
          <Row>
            <button className='btn booking_btn mb-4'>
              <Link to={`/tours`}>Back</Link>
            </button>
            <Col lg='7'>
              <div className='tour_content'>
                {imageSrc && <img src={imageSrc} alt='tour-image' />}
              </div>
            </Col>
            <Col lg='5'>
              <div className='tour_info'>
                <h2>{location.name}</h2>
                <div className='d-flex align-items-center gap-5'>
                  <span>
                    <i class="ri-map-pin-fill"></i>{location.address}
                  </span>
                </div>
                <div className='tour_extra-details'>
                  <span><i class="ri-money-dollar-circle-line"></i>${location.price} /person</span>
                  <span><i class="ri-map-pin-2-line"></i>{location.type && location.type.join(', ')}</span>
                </div>
                <h5>Description</h5>
                {location.description > 0 ? (
                  <p>{location.description}</p>
                ) : (
                  <p>No description available</p>
                )}
              </div>
              <Button className='btn primary__btn w-100 mt-4' onClick={handleClick}>Add to Planner</Button>
            </Col>
          </Row>
        </Container>
      </section>
    );
}

export default TourDetails