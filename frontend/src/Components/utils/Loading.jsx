import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      style={{
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // Light background color
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