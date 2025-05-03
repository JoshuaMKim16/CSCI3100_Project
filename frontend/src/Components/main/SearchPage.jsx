// /client/src/Components/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Container} from 'reactstrap'
import './searchpage.css';

const SearchPage = () => {
  // Get the passed search query from navigation state, if available.
  const { state } = useLocation();
  const initialQuery = state?.query || '';
  
  // State for the search input as well as locations loaded from the backend
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const navigate = useNavigate();

  // Fetch locations from the backend
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

  // Filter locations based on the search input (when either changes)
  useEffect(() => {
    const queryLower = searchInput.toLowerCase();
    const matches = locations.filter((location) =>
      (location.name || "").toLowerCase().includes(queryLower) ||
      (location.description || "").toLowerCase().includes(queryLower) ||
      (location.category || "").toLowerCase().includes(queryLower)
    );
    setFilteredLocations(matches);
  }, [locations, searchInput]);

  // Handler for search input change
  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
  };

  // Handler for search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The filtering is done on-the-fly via the useEffect that depends on searchInput.
    // You may also update the URL query string if needed here.
  };

  // Redirect to the specific tour details page when a location is clicked
  const handleLocationClick = (id) => {
    navigate(`/tours/${id}`);
  };

  return (
    <Container style={{height: '90vh', width: '100%'}}>
      <div className="search-page-container" style={{ padding: '20px' }}>
        <h1>Search Hong Kong Attractions</h1>
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search attractions..."
            value={searchInput}
            onChange={handleSearchChange}
            style={{ padding: '10px', fontSize: '16px', width: '300px' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              marginLeft: '10px',
              fontSize: '16px',
              backgroundColor: '#61dafb',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>

        <h2>Search Results for "{searchInput}"</h2>
        <div style={{ marginTop: '20px' }}>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <div
                key={location._id}
                onClick={() => handleLocationClick(location._id)}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                <h3>{location.name}</h3>
                <p>{location.description}</p>
                <p>
                  <strong>Category:</strong> {location.category}
                </p>
              </div>
            ))
          ) : (
            <p>No matching locations found.</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default SearchPage;