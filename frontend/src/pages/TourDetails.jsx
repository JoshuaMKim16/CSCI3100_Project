import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Form, ListGroup} from 'reactstrap';
import {useParams} from 'react-router-dom'
import '../styles/tour-details.css'; // Reuse the existing styles

const TourDetails = () => {
  const {id} = useParams();
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);

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

    const [imageSrc, setImageSrc] = useState(null)
        useEffect(() => {
          const loadImage = async () => {
            try {
              const imageModule = await import(`../assets/site_data/${location.picture}`)
              setImageSrc(imageModule.default)
            } catch (error) {
              console.error('Error loading the image:', error)
            }
          }
          loadImage();
        })

        return (
          <>
          <section>
            <Container>
              <Row>
                <Col lg='8'>
                  <div className='tour_content'>
                    <h1>{id}</h1>
                    {imageSrc && <img src={imageSrc} alt='tour-image' />}
                    <div className='tour_info'>
                      <h2>{location.name}</h2>
                      <div className='d-flex align-items-center gap-5'>
                        <span className='tour_rating d-flex align-items-center gap-1'>
                        </span>
                          <span>
                            <i class="ri-map-pin-fill"></i>{location.address}
                          </span>
                      </div>
                      <div className='tour_extra-details'>
                        <span><i class="ri-map-pin-2-line"></i>{location}</span>
                        <span><i class="ri-money-dollar-circle-line"></i>${location.price} /person</span>
                      </div>
                      <h5>Description</h5>
                      <p>{location.description}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
          </>
          );
}

export default TourDetails