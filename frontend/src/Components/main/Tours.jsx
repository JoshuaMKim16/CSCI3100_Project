import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TourCard from "./TourCard";
import Loading from "../utils/Loading"; 
import hkBackground from "./hk_background.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../../App.css";
import ChatbotFAB from "../utils/AIChatbot";

const Tours = () => {
  const [touristAttractions, setTouristAttractions] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); 
  const [fadeOut, setFadeOut] = useState(false); 
  const [fadeIn, setFadeIn] = useState(false); 

  const navigate = useNavigate();
  const tourSectionRef = useRef(null);

  // Simulate a 1.5-second loading delay with both fade-out and fade-in
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); 
      setTimeout(() => {
        setLoading(false); 
        setFadeIn(true); 
      }, 500); 
    }, 1500);

    return () => clearTimeout(timer); 
  }, []);

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en"
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather([]);
    }
  };

  // Fetch locations data
  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/locations");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    }
  };

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/login"); 
  };

  // Fetch weather and location data
  useEffect(() => {
    fetchWeather();
    fetchLocations();
  }, []);

  // Calculate page count
  useEffect(() => {
    const pages = Math.ceil(locations.length / 2);
    setPageCount(pages);
  }, [locations]);

  const currentLocations = locations.slice(page * 2, page * 2 + 2);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/searchpage", { state: { query: searchTerm } });
  };

  const handleScrollToTours = () => {
    if (tourSectionRef.current) {
      tourSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigateToPlanner = () => {
    navigate("/planner");
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  const navbarFontColor = "white";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Conditional rendering for the loading page */}
      {loading ? (
        <div
          className={`loading-container ${fadeOut ? "fade-out" : ""}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1000,
          }}
        >
          <Loading />
        </div>
      ) : (
        <div className={`main-content ${fadeIn ? "fade-in" : ""}`}>
          {/* Navbar */}
          <AppBar
            position="fixed"
            style={{
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <Toolbar
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", 
              }}
            >
              {/* Left Section: TravelTailor Logo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h4"
                  onClick={() => navigate("/main")}
                  style={{
                    fontFamily: "cursive",
                    fontSize: "32px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  TravelTailor
                </Typography>
              </Box>

              {/* Center Section (Navbar Items) */}
              <Box
                sx={{
                  display: "flex",
                  gap: "30px",
                }}
              >
                <Button
                  color="inherit"
                  onClick={() => navigate("/main")} 
                  style={{
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
                  style={{
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
                  style={{
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
                  style={{
                    color: navbarFontColor,
                    fontSize: "18px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  PLANNER
                </Button>
              </Box>

              {/* Right Section (Profile and Logout Buttons) */}
              <Box
                sx={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                <Button
                  color="inherit"
                  onClick={handleNavigateToProfile}
                  style={{
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
                  style={{
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

          {/* First Section: Background Image */}
          <div
            style={{
              backgroundImage: `url(${hkBackground})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100vw",
              height: "100vh",
            }}
          >
            <Container
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h2"
                style={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <b>Explore Hong Kong For Your Next Adventure</b>
              </Typography>

              {/* Search Bar */}
              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  width: "100%",
                  maxWidth: "500px",
                  backgroundColor: "white",
                  borderRadius: "50px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  padding: "5px 15px",
                }}
              >
                <SearchOutlinedIcon style={{ color: "gray", marginRight: "10px" }} />

                <TextField
                  variant="standard"
                  fullWidth
                  placeholder="Search for a location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    style: { fontFamily: "Poppins, sans-serif", paddingLeft: "10px" },
                  }}
                />

                <IconButton
                  type="submit"
                  color="primary"
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#1976D2",
                    color: "white",
                    borderRadius: "50%",
                    padding: "5px",
                    width: "35px",
                    height: "35px",
                  }}
                >
                  <ArrowForwardIcon style={{ fontSize: "18px" }} />
                </IconButton>
              </Box>
            </Container>
          </div>
        </div>
      )}
      {/* Integrate the AI Chatbot FAB  */}
      <ChatbotFAB />
    </div>
  );
};

export default Tours;