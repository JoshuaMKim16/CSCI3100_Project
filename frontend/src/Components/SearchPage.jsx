import React, { useState, useEffect } from 'react';
import './searchpage.css'; // Reuse the existing styles

const SearchPage = () => {
  // State for search input, filters, sorting criteria, and locations
  const [searchInput, setSearchInput] = useState('');
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filter, setFilter] = useState('all'); // Filter by category
  const [criteria, setCriteria] = useState('relevance'); // Sorting criteria

  // Fetch locations from the backend
  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/locations');
      console.log(response);
      const data = await response.json();
      console.log(data);
      setLocations(data);
      setFilteredLocations(data); // Initially, filtered locations are the same
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
      setFilteredLocations([]);
    }
  };

  // Apply search, filter, and sort on the client side
  const applySearchFilterSort = (input, filterValue, sortCriteria) => {
    let result = [...locations];

    // Apply search
    if (input) {
      const searchQuery = input.toLowerCase();
      result = result.filter(location =>
        (location.name || "").toLowerCase().includes(searchQuery) ||
        (location.description || "").toLowerCase().includes(searchQuery) ||
        (location.category || "").toLowerCase().includes(searchQuery)
      );
    }

    // Apply filter
    if (filterValue !== 'all') {
      result = result.filter(location =>
        (location.category || "").toLowerCase() === filterValue.toLowerCase()
      );
    }

    // Apply sort
    if (sortCriteria === 'name') {
      result.sort((a, b) => (a.name || "").localeCompare((b.name || "")));
    } else if (sortCriteria === 'relevance') {
      // Keep the original order from the JSON file
    }

    setFilteredLocations(result);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    applySearchFilterSort(input, filter, criteria);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    applySearchFilterSort(searchInput, newFilter, criteria);
  };

  // Handle sort criteria change
  const handleSortChange = (e) => {
    const newCriteria = e.target.value;
    setCriteria(newCriteria);
    applySearchFilterSort(searchInput, filter, newCriteria);
  };

  // Get event details (mock implementation)
  const getEventDetails = (siteId) => {
    alert(`Fetching details for site ID: ${siteId}`);
  };

  // Add to cart (mock implementation)
  const addToCart = (siteId) => {
    alert(`Added site ID ${siteId} to cart`);
  };

  // Save location (mock implementation)
  const saveLocation = (siteId) => {
    alert(`Saved site ID ${siteId}`);
  };

  // Fetch initial locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Search Hong Kong Attractions</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search attractions..."
          value={searchInput}
          onChange={handleSearchChange}
          style={{ padding: '10px', fontSize: '16px', width: '300px', marginBottom: '20px' }}
        />

        {/* Filter and Sort Controls */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>
            Filter by Category:
            <select value={filter} onChange={handleFilterChange} style={{ marginLeft: '5px' }}>
              <option value="all">All</option>
              <option value="park">Park</option>
              <option value="museum">Museum</option>
              <option value="landmark">Landmark</option>
            </select>
          </label>

          <label>
            Sort by:
            <select value={criteria} onChange={handleSortChange} style={{ marginLeft: '5px' }}>
              <option value="relevance">Relevance</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        {/* Display Locations */}
        <div style={{ width: '80%', textAlign: 'left' }}>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <div
                key={location.id}
                style={{
                  border: '1px solid #61dafb',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3>{location.name}</h3>
                  <p>{location.description}</p>
                  <p>Category: {location.category}</p>
                  <button
                    onClick={() => getEventDetails(location.id)}
                    style={{ marginRight: '10px', padding: '5px 10px' }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => addToCart(location.id)}
                    style={{ marginRight: '10px', padding: '5px 10px' }}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => saveLocation(location.id)}
                    style={{ padding: '5px 10px' }}
                  >
                    Save Location
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No attractions found.</p>
          )}
        </div>
      </header>
    </div>
  );
};

export default SearchPage;