import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Carousel from 'react-material-ui-carousel';
import Typography from '@mui/material/Typography';
import hkBackground from "./hk_background.png"; 
import ChatbotFAB from "../utils/AIChatbot";

// Overall searchpage logic
const SearchPage = () => {
  const { state } = useLocation();
  const initialQuery = state?.query || '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 4; // 4 results per page

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Select 7 random locations for the carousel.
  const [carouselLocations, setCarouselLocations] = useState([]);
  const [carouselImages, setCarouselImages] = useState({});

  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  // Fetch all locations
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

  // Randomly choose 7 locations for the carousel
  useEffect(() => {
    if (locations.length > 0) {
      const shuffled = [...locations].sort(() => Math.random() - 0.5);
      setCarouselLocations(shuffled.slice(0, 7));
    }
  }, [locations]);

  // Fetch images only for these 7 carousel locations to avoid unnecessary API over-fetching
  useEffect(() => {
    const fetchCarouselImages = async () => {
      const newImages = {};
      await Promise.all(
        carouselLocations.map(async (loc) => {
          try {
            if (loc.picture && loc.picture.length > 0) {
              const filename = loc.picture[0].split('/').pop().split('.')[0]; 
              const response = await fetch(`http://localhost:3000/api/photos/${filename}`); // Fetch by filename from Cloudinary
              if (!response.ok) {
                throw new Error('Fetching specific image failed');
              }
              const data = await response.json();
              newImages[loc._id] = data.secure_url ? data.secure_url : hkBackground;
            } else {
              newImages[loc._id] = hkBackground;
            }
          } catch (err) {
            console.error('Error fetching carousel image for', loc.name, ":", err);
            newImages[loc._id] = hkBackground;
          }
        })
      );
      setCarouselImages(newImages);
    };

    if (carouselLocations.length > 0) {
      fetchCarouselImages();
    }
  }, [carouselLocations]);

  // Handle search submission.
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    filterLocations();
  };

  // Navigate to individual tour page.
  const handleLocationClick = (id) => {
    navigate(`/tours/${id}`);
  };

  // Filter locations based on search input and selected categories.
  const filterLocations = () => {
    const queryLower = searchInput.toLowerCase();
    const matches = locations.filter((location) => {
      const matchesSearch =
        (location.name || '').toLowerCase().includes(queryLower) ||
        (location.description || '').toLowerCase().includes(queryLower);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.every((selectedCategory) => location.type.includes(selectedCategory));
      return matchesSearch && matchesCategory;
    });
    setFilteredLocations(matches);
    setCurrentPage(1);
    const categoriesFromResults = Array.from(new Set(matches.flatMap((location) => location.type)));
    setFilteredCategories(categoriesFromResults);
  };

  useEffect(() => {
    if (hasSearched) {
      filterLocations();
    }
  }, [selectedCategories]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredLocations.slice(indexOfFirstResult, indexOfLastResult);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Helper to format category names
  const formatCategory = (categoryArray) => {
    if (!Array.isArray(categoryArray)) return '';
    return categoryArray
      .map((category) =>
        category
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
      .join(', ');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', backgroundColor: "#fdfcfc" }}>
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "transparent", boxShadow: "none", zIndex: 1300 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <Box sx={{ display: "flex", gap: "20px", textAlign: "left" }}>
            <Typography
              variant="h4"
              onClick={() => navigate("/main")}
              sx={{
                fontFamily: "cursive",
                fontSize: "32px",
                color: "black",
                cursor: "pointer",
              }}
            >
              TravelTailor
            </Typography>
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: "30px",
              textAlign: "center",
            }}
          >
            <Button
              color="inherit"
              onClick={() => navigate("/main")}
              sx={{ color: "black", fontSize: "18px", fontFamily: "Poppins, sans-serif" }}
            >
              HOME
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/tour")}
              sx={{ color: "black", fontSize: "18px", fontFamily: "Poppins, sans-serif" }}
            >
              TOUR
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/forum")}
              sx={{ color: "black", fontSize: "18px", fontFamily: "Poppins, sans-serif" }}
            >
              FORUM
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/planner")}
              sx={{ color: "black", fontSize: "18px", fontFamily: "Poppins, sans-serif" }}
            >
              PLANNER
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: "15px", textAlign: "right" }}>
            <Button
              color="inherit"
              onClick={() => navigate("/profile")}
              sx={{
                color: "black",
                fontFamily: "Poppins, sans-serif",
                border: "2px solid white",
                borderRadius: "10%",
                padding: "5px 10px",
                minWidth: "40px",
                height: "40px",
                fontSize: "14px",
              }}
            >
              PROFILE
            </Button>
            <Button
              onClick={() => navigate("/login")}
              sx={{
                color: "skyblue",
                fontFamily: "Poppins, sans-serif",
                padding: "5px 15px",
                borderRadius: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              LOGOUT
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      <Box
        sx={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          padding: '10px 20px',
          zIndex: 1200,
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '50%',
            }}
          >
            <input
              type="text"
              placeholder="Search attractions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                padding: '10px 50px 10px 15px',
                fontSize: '18px',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '20px',
              }}
            />
            <SearchIcon
              style={{
                position: 'absolute',
                right: '10px',
                bottom: '25px',
                color: '#888',
                cursor: 'pointer',
              }}
              onClick={handleSearchSubmit}
            />
          </div>
        </form>
      </Box>

      {/* Main Content Wrapper */}
      <Box sx={{ position: 'relative', marginTop: '165px', width: '100%' }}>
        {!hasSearched && carouselLocations.length > 0 && (
          <Box sx={{ width: '80%', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'lightblue' }}>
              Trending Destinations
            </h2>
            <Carousel
              autoPlay={true}
              interval={5000}
              indicators={false}
              navButtonsAlwaysInvisible
              indicatorContainerProps={{
                style: {
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
              }}
            >
              {carouselLocations.map((location) => (
                <Box
                  key={location._id}
                  onClick={() => handleLocationClick(location._id)}
                  sx={{
                    position: 'relative',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {/* Render the image from the pre-fetched carouselImages mapping */}
                  {carouselImages[location._id] ? (
                    <img
                      src={carouselImages[location._id]}
                      alt={location.name}
                      style={{
                        width: '75%',
                        height: '600px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  ) : (
                    // Loading indicator if the API call is still in progress.
                    <div
                      style={{
                        width: '75%',
                        height: '600px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px'
                      }}
                    >
                      <p>Loading...</p>
                    </div>
                  )}
                  <h3 style={{ marginTop: '10px' }}>{location.name}</h3>
                </Box>
              ))}
            </Carousel>
          </Box>
        )}

        {/* Filters and Search Results */}
        {hasSearched && (
          <Box
            sx={{
              marginTop: '50px',
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            {/* Filter Sidebar */}
            <Box
              sx={{
                width: '25%',
                maxWidth: '300px',
                marginRight: '20px',
                backgroundColor: '#f8f8f8',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3>Filter by Category</h3>
              {filteredCategories.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                  }
                  label={formatCategory([category])}
                />
              ))}
            </Box>

            {/* Search Results */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '20px',
                paddingTop: '1px',
                maxWidth: '800px',
              }}
            >
              <h2 style={{ textAlign: 'center' }}>Search Results</h2>
              <div style={{ marginTop: '20px' }}>
                {currentResults.length > 0 ? (
                  currentResults.map((location) => (
                    <div
                      key={location._id}
                      onClick={() => handleLocationClick(location._id)}
                      style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <h3>{location.name}</h3>
                      <p>{location.description}</p>
                      <p>
                        <strong>Category:</strong> {formatCategory(location.type)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No matching locations found.</p>
                )}
              </div>

              {/* Pagination */}
              {filteredLocations.length > resultsPerPage && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                  }}
                >
                  <Pagination
                    count={Math.ceil(filteredLocations.length / resultsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      <ChatbotFAB />
    </div>
  );
};

export default SearchPage;