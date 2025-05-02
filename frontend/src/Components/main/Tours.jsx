// /client/src/Components/Tours.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonSection from '../login/Start'; // or import your actual CommonSection if you have one
import TourCard from "./TourCard"; 
// import Newsletter from "../Components/Newsletter"; // adjust if you have this component in Components
import { Container, Row, Input, Button, Form, FormGroup } from 'reactstrap';
// import "../../styles/tour.css"; // assuming tour.css is still managed centrally

const Tours = () => {
  // State for fetching location
  const [locations, setLocations] = useState([]);

  // State for fetching weather
  const [weather, setWeather] = useState([]);

  // States for dividing locations into pages
  const itemsPerPage = 5; // Now displaying 5 items per page horizontally
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
      console.log(response);
      console.log(data);
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
          {/* Weather */}
          <div>
            <p>Weather forecast</p>
            <p>Today's weather: {weather.forecastDesc}</p>
            <p>Weather forecast: {weather.outlook}</p>
            <p>Latest update time: {weather.updateTime}</p>
          </div>

          {/* Search Bar */}
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

          {/* Tour Cards Section arranged horizontally */}
          <div className="d-flex flex-wrap justify-content-start">
            {currentLocations.map((location) => (
              <div
                key={location._id}
                style={{
                  flex: '0 0 20%', // Each card takes 20% width, ensuring 5 per row
                  maxWidth: '20%',
                  padding: '0.5rem',
                }}
              >
                <TourCard location={location} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Row className="mt-4">
            <div className="w-100 d-flex justify-content-center gap-3">
              {[...Array(pageCount).keys()].map((number) => (
                <span
                  key={number}
                  onClick={() => setPage(number)}
                  className={page === number ? 'active_page' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  {number + 1}
                </span>
              ))}
            </div>
          </Row>
      </section>
  );
};

export default Tours;