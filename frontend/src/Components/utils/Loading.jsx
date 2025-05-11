import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

// Loading page
const Loading = () => {
  return (
    <Box
      style={{
        height: "100vh", 
        width: "100vw", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", 
      }}
    >
      {/* Material UI CircularProgress Loader */}
      <CircularProgress style={{ color: "#1976D2", marginBottom: "20px" }} size={80} />

      {/* Travel-related Text */}
      <Typography
        variant="h5"
        style={{
          fontFamily: "Poppins, sans-serif",
          textAlign: "center",
          color: "#1976D2",
          marginBottom: "10px",
        }}
      >
        Preparing your next adventure...
      </Typography>

      <Typography
        variant="subtitle1"
        style={{
          fontFamily: "Poppins, sans-serif",
          textAlign: "center",
          color: "#555",
        }}
      >
        Sit back, relax, and let us take you to the best locations in Hong Kong!
      </Typography>
    </Box>
  );
};

export default Loading;
