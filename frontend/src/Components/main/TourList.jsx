import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  AppBar,
  Toolbar,
  Button,
  Modal,
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TourCard from "./TourCard";
import hkBackground from "./hk_background1.jpg";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import ChatbotFAB from "../utils/AIChatbot";

// FakeCommentsCarousel Component
const FakeCommentsCarousel = () => {
  // Six fake comments
  const comments = [
    { name: "Joshua", comment: "I loved exploring these hidden gems!, and CSCI3100" },
    { name: "Esther", comment: "A perfect blend of tradition and modern marvels." },
    { name: "Andrew", comment: "The museums are a treasure trove of history." },
    { name: "Ian", comment: "A must-visit destination in the world, especially CUHK." },
    { name: "Andy", comment: "Exquisite dining and breathtaking attractions!" },
    { name: "Jake", comment: "Love being here! I don't want to leave" }
  ];

  // We'll display 3 items at a time.
  const visibleCount = 3;
  // The activeIndex represents the leftmost visible card
  const [activeIndex, setActiveIndex] = useState(0);

  // Adjust card dimensions so that exactly 3 cards are visible.
  const cardWidth = 300;       // Increased card width
  const cardMargin = 10;       // Increased margin
  const cardTotalWidth = cardWidth + cardMargin * 4.5; // Total width per card

  useEffect(() => {
    const totalGroups = comments.length - visibleCount + 1;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalGroups);
    }, 5000); // Shift every 5 seconds
    return () => clearInterval(interval);
  }, [comments.length, visibleCount]);

  return (
    <Box
      sx={{
        width: `${cardTotalWidth * visibleCount * 1.15}px`, // Container width = 3 cards
        overflow: "hidden",
        mx: "auto",
        my: 4,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          transition: "transform 0.6s ease-in-out",
          transform: `translateX(-${activeIndex * cardTotalWidth}px)`,
        }}
      >
        {comments.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: "0 0 auto",
              width: `${cardWidth}px`,
              m: `${cardMargin}px`,
              backgroundColor: "rgba(240,248,255,0.9)",
              p: 3,
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontStyle: "italic",
                mb: 1,
              }}
            >
              "{item.comment}"
            </Typography>
            <Rating
              name="read-only-rating"
              value={5}
              readOnly
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
              }}
            >
              - {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const TourList = () => {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState({});
  const [showNavbar, setShowNavbar] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [forecastModalOpen, setForecastModalOpen] = useState(false);
  const navigate = useNavigate();
  const navbarFontColor = "black";

  const handleNavigateToProfile = () => navigate("/profile");
  const handleNavigateToPlanner = () => navigate("/planner");
  const handleLogout = () => {
    console.log("Logged out");
    navigate("/login");
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/locations");
      const data = await response.json();
      setLocations(data);

      const categorized = {};
      data.forEach((location) => {
        location.type.forEach((category) => {
          if (!categorized[category]) {
            categorized[category] = [];
          }
          categorized[category].push(location);
        });
      });

      // Only take the first four items of each category.
      setCategories({
        museum: (categorized["museum"] || []).slice(0, 4),
        tourist_attraction: (categorized["tourist_attraction"] || []).slice(0, 4),
        restaurant: (categorized["restaurant"] || []).slice(0, 4),
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    }
  };

  // Helper to select a weather icon based on forecastWeather string.
  const getWeatherIcon = (forecastWeather = "") => {
    const lowerDesc = forecastWeather.toLowerCase();
    if (lowerDesc.includes("thunderstorms") || lowerDesc.includes("showers")) {
      return <ThunderstormIcon fontSize="medium" />;
    }
    if (lowerDesc.includes("cloudy")) {
      return <CloudIcon fontSize="medium" />;
    }
    if (lowerDesc.includes("sunny")) {
      return <WbSunnyIcon fontSize="medium" />;
    }
    return <WbSunnyIcon fontSize="medium" />;
  };

  // Fetch forecast data (Hong Kong 7-day forecast) from the provided API.
  const fetchForecast = async () => {
    try {
      const response = await fetch(
        "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en"
      );
      const data = await response.json();
      setForecast(data);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      setForecast(null);
    }
  };

  const handleOpenForecastModal = async () => {
    await fetchForecast();
    setForecastModalOpen(true);
  };

  const handleCloseForecastModal = () => {
    setForecastModalOpen(false);
  };

  // Fetch locations when component mounts.
  useEffect(() => {
    fetchLocations();
  }, []);

  // Hide navbar on scroll past the background image.
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Render category without forcing the title to align with the leftmost card.
  const renderCategory = (label, items) => (
    <Box
      sx={{
        marginBottom: 6,
        width: "100%",
        paddingX: "20px",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontFamily: "Poppins, sans-serif",
          mb: 4,
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        {label}
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {items.map((location, index) => (
          <Grid
            item
            key={index}
            xs={12}   // Full width on extra-small screens
            sm={6}    // 2 per row on small screens
            md={3}    // 4 per row on medium and up
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TourCard location={location} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "Poppins, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Navbar */}
      {showNavbar && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            zIndex: 1300,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Left Section: TravelTailor Logo */}
            <Box sx={{ display: "flex", gap: "20px", textAlign: "left" }}>
              <Typography
                variant="h4"
                onClick={() => navigate("/")}
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

            {/* Center Section */}
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
                sx={{
                  color: navbarFontColor,
                  fontSize: "18px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                HOME
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/tour")}
                sx={{
                  color: navbarFontColor,
                  fontSize: "18px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                TOUR
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/forum")}
                sx={{
                  color: navbarFontColor,
                  fontSize: "18px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                FORUM
              </Button>
              <Button
                color="inherit"
                onClick={handleNavigateToPlanner}
                sx={{
                  color: navbarFontColor,
                  fontSize: "18px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                PLANNER
              </Button>
            </Box>

            {/* Right Section */}
            <Box sx={{ display: "flex", gap: "15px", textAlign: "right" }}>
              <Button
                color="inherit"
                onClick={handleNavigateToProfile}
                sx={{
                  color: navbarFontColor,
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
                onClick={handleLogout}
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
      )}

      {/* Main Content */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1920px",
          margin: "0 auto",
          position: "absolute",
        }}
      >
        {/* Hong Kong Background Section */}
        <Box
          sx={{
            position: "relative",
            width: "100vw",
            height: "25vw",
            minHeight: "300px",
            backgroundImage: `url(${hkBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Left side: clickable text to open modal */}
          <Box
            sx={{
              position: "absolute",
              bottom: "10px",
              left: "20px",
              cursor: "pointer",
            }}
            onClick={handleOpenForecastModal}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontFamily: "Poppins, sans-serif",
                textDecoration: "underline",
              }}
            >
              Hong Kong Weather Forecast
            </Typography>
          </Box>
          {/* Right side: "Hong Kong" text */}
          <Box
            sx={{
              position: "absolute",
              bottom: "10px",
              right: "20px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              }}
            >
              Hong Kong
            </Typography>
          </Box>
        </Box>

        {/* Fake Comments Carousel */}
        <FakeCommentsCarousel />

        {/* Render Categories */}
        <Box sx={{ zIndex: "1", marginTop: "40px" }}>
          {["museum", "tourist_attraction", "restaurant"].map((category) =>
            categories[category]?.length > 0
              ? renderCategory(
                  category === "museum"
                    ? "Museum"
                    : category === "tourist_attraction"
                    ? "Tourist Attraction"
                    : "Restaurant",
                  categories[category]
                )
              : null
          )}
        </Box>

        {/* Skyblue Footer Section with inline Text & Button */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "skyblue",
            py: 2,
            px: 2,
            mt: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
            }}
          >
            Still can't decide? Search and Explore more!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/searchpage")}
            size="small"
            sx={{
              ml: 2,
              backgroundColor: "white",
              color: "skyblue",
              fontFamily: "Poppins, sans-serif",
              borderRadius: "50px",
              px: 2,
              py: 0.5,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Go Search!
          </Button>
        </Box>
      </Box>

      {/* 7-Day Forecast Modal */}
      <Modal open={forecastModalOpen} onClose={handleCloseForecastModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: 500 },
            maxHeight: { xs: "80vh", md: "80vh" },
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              mb: 2,
              textAlign: "center",
            }}
          >
            7-Day Forecast
          </Typography>
          {forecast && forecast.weatherForecast ? (
            <Box>
              {forecast.weatherForecast.slice(0, 7).map((day, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e0e0e0",
                    py: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      width: "30%",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {day.forecastDate}
                  </Typography>
                  <Box sx={{ width: "20%" }}>
                    {getWeatherIcon(day.forecastWeather)}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      width: "25%",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {day.forecastMintemp.value}°C
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      width: "25%",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {day.forecastMaxtemp.value}°C
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontFamily: "Poppins, sans-serif" }}
            >
              No forecast data available.
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleCloseForecastModal}
              sx={{
                backgroundColor: "skyblue",
                color: "white",
                fontFamily: "Poppins, sans-serif",
                ":hover": { backgroundColor: "deepskyblue" },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      <ChatbotFAB />
    </Box>
  );
};

export default TourList;