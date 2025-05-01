// /client/src/Components/Tours.jsx
import React, { useState, useEffect } from 'react';
import CommonSection from '../login/Start'; // or import your actual CommonSection if you have one
import TourCard from "./TourCard"; 
// import Newsletter from "../Components/Newsletter"; // adjust if you have this component in Components
import { Container, Row, Col } from 'reactstrap';
// import "../../styles/tour.css"; // assuming tour.css is still managed centrally

const Tours = () => {
  const [locations, setLocations] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const pages = Math.ceil(locations.length / 8);
    setPageCount(pages);
  }, [locations, page]);

  return (
    <>
      {/* Replace with your actual CommonSection component if available */}
      <section>
        <Container>
          <Row>
            {locations.map((location) => (
              <Col lg="3" className="mb-4" key={location._id}>
                <TourCard location={location} />
              </Col>
            ))}
            <Col lg="12">
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map(number => (
                  <span
                    key={number}
                    onClick={() => setPage(number)}
                    className={page === number ? 'active_page' : ''}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <Newsletter /> */}
    </>
  );
};

export default Tours;