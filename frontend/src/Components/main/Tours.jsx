// /client/src/Components/Tours.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TourCard from "./TourCard"; 
import { Container, Col, Row, Input, Button, Form, FormGroup } from 'reactstrap';

const Tours = () => {
  // State for fetching location
  const [locations, setLocations] = useState([]);

  // State for fetching weather
  const [weather, setWeather] = useState([]);

  // States for dividing locations into pages
  const itemsPerPage = 2; // Now displaying 5 items per page horizontally
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  // State for searching
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch weather
  const fetchWeather = async() => {
    try{
      const response = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en');
      const data = await response.json();
      setWeather(data);
    } catch(error) {
      console.error('Error fetching weather:', error);
      setWeather([]);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // Fetch loactions
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

  // Update page count based on locations count and items per page
  useEffect(() => {
    const pages = Math.ceil(locations.length / itemsPerPage);
    setPageCount(pages);
  }, [locations]);

  // Get locations for the current page
  const currentLocations = locations.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  // Handle search submission and redirect to /searchpage
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/searchpage', { state: { query: searchTerm } });
  };

  return (
      <section>
        <Container style={{height: '90vh', width: '95%', margin: '0 auto'}}>
          {/* Weather */}
          <div style={{overflowWrap: 'break-word', width: '100%'}}>
            <p>Weather forecast</p>
            <p>Today's weather: {weather.forecastDesc}</p>
            <p>Weather forecast: {weather.outlook}</p>
            <p>Latest update time: {weather.updateTime}</p>
          </div>

          {/* Search Bar */}
          <section>
            <Container>
              <Row className="mb-4">
                <div className="d-flex w-100">
                  <Form onSubmit={handleSearchSubmit} className="d-flex w-100">
                    <FormGroup className="flex-grow-1 me-2">
                      <Input
                        type="text"
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </FormGroup>
                    <Button type="submit" color="primary">
                      Search
                    </Button>
                  </Form>
                </div>
              </Row>
              <br/>
            </Container>
          </section>

          {/* Tour Cards Section arranged horizontally */}
          <section className='pt-0'>
            <Container>
              <Row>
                <div className="d-flex flex-wrap justify-content-start">
                  {currentLocations.map((location) => (
                    <Col lg='3' className='mb-4' style={{ border: '1px solid gray'}}>
                      <TourCard location={location}/>
                    </Col>
                  ))}
                </div>
              </Row>
            </Container>
          </section>
          <br/>

          {/* Pagination */}
          <Container style={{margin: '0 auto'}}>
            <div>
              {page > -1 && (
                <span
                    onClick={() => setPage(0)}
                    style={{ cursor: 'pointer' }}
                >
                &lt;&lt;
                </span>
              )}
              {page > -1 && (
                <span
                    onClick={() => {
                      if (page === 0) {
                        setPage(0);
                      } else{
                        setPage(page - 1)
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                &lt;
                </span>
              )}
              <span>
                {page + 1} / {pageCount}
              </span>
              {page < pageCount && (
                <span
                    onClick={() => {
                      if (page === pageCount - 1) {
                        setPage(pageCount - 1)
                      } else {
                        setPage(page + 1)
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                &gt;
                </span>
              )}
              {page < pageCount && (
                <span
                    onClick={() => setPage(pageCount - 1)}
                    style={{ cursor: 'pointer' }}
                >
                &gt;&gt;
                </span>
                )}
            </div>
          </Container>
        </Container>
      </section>
  );
};

export default Tours;