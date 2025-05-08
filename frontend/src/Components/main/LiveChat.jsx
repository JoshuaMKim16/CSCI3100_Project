import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import SendIcon from '@mui/icons-material/Send';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ChatbotFAB from "../utils/AIChatbot";

const ENDPOINT = "http://localhost:3000";
let socket;

// Function to generate a random username (e.g., User_abc123)
const generateRandomUsername = () => {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `User_${randomStr}`;
};

const LiveChat = () => {
  const navigate = useNavigate();
  const [sender, setSender] = useState(generateRandomUsername());
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const chatEndRef = useRef(null);

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Connect to Socket.IO server and setup join/exit events
  useEffect(() => {
    socket = io(ENDPOINT);

    // Listen for incoming messages and system notifications
    socket.on('chat message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    // Notify others that this user has joined
    socket.emit('chat message', {
      sender: 'System',
      text: `${sender} has entered the chat.`,
      timestamp: Date.now(),
      system: true
    });

    // Listen for the browser unload to notify exit
    const handleBeforeUnload = () => {
      socket.emit('chat message', {
        sender: 'System',
        text: `${sender} has left the chat.`,
        timestamp: Date.now(),
        system: true
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload(); // Notify before unmount
      window.removeEventListener('beforeunload', handleBeforeUnload);
      socket.disconnect();
    };
  }, [sender]);

  // Auto-scroll when new messages arrive within the chat container
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const msgObject = {
        sender,
        text: message,
        timestamp: Date.now(),
        system: false
      };
      socket.emit('chat message', msgObject);
      setMessage('');
    }
  };

  // Overall outer container style (no scroll for the whole page)
  const outerContainerStyles = {
    backgroundColor: "#fdfcfc",
    height: "100vh", // Fixed height prevents page scrolling
    overflow: "hidden", // Hides any overflow from the page
    fontFamily: "Poppins, sans-serif",
  };

  // Wrapper for the chat box
  const wrapperStyles = {
    maxWidth: "1200px",       // Increase the overall width
    height: "700px",          // Increase the overall height of chat box
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative"
  };

  // Chat container that supports internal scrolling for messages only
  const chatContainerStyles = {
    flex: 1,
    padding: "20px",        // Increased padding for larger area
    overflowY: "auto",      // Auto-scroll within the chatbox
    backgroundColor: "#fdfcfc"
  };

  const inputContainerStyles = {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderTop: "1px solid #ccc"
  };

  return (
    <div style={outerContainerStyles}>
      {/* Navigation Bar */}
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
          {/* Left Section: TravelTailor Logo in Black */}
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

          {/* Center Section (Navbar Items) */}
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
                color: "black",
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
                color: "black",
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
                color: "black",
                fontSize: "18px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              FORUM
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/planner")}
              sx={{
                color: "black",
                fontSize: "18px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              PLANNER
            </Button>
          </Box>

          {/* Right Section (Profile & Logout Buttons) */}
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

      {/* Main Chat Area */}
      <div style={{ ...wrapperStyles, marginTop: "80px" }}>
        {/* Chat container */}
        <div style={chatContainerStyles}>
          {/* Community Guidelines */}
          {showGuidelines && (
            <div
              style={{
                backgroundColor: "#fffbcc",
                border: "1px solid #ffe58a",
                padding: "10px",
                borderRadius: "12px",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              <strong>Community Guidelines:</strong> Please be respectful, refrain from harmful language or spreading false information, and enjoy healthy discussions.
              <button
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  border: "none",
                  backgroundColor: "#358aff",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
                onClick={() => setShowGuidelines(false)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Chat messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {chat.map((msg, index) => {
              // Check if the message is a system message by either flag or sender name
              if (msg.system || msg.sender === "System") {
                return (
                  <div
                    key={index}
                    style={{
                      textAlign: "center",
                      color: "#888",
                      fontStyle: "italic",
                      fontSize: "0.9rem",
                    }}
                  >
                    {`{-- System Message: ${msg.text} --}`}
                    <div style={{ fontSize: "0.7rem", color: "#aaa" }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                );
              }
              const isCurrentUser = msg.sender === sender;
              return (
                <div
                  key={index}
                  style={{
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                    backgroundColor: isCurrentUser ? "#358aff" : "#d8d8d8",
                    color: isCurrentUser ? "#fff" : "#000",
                    padding: "15px",
                    borderRadius: "25px",
                    maxWidth: "33%",
                    wordWrap: "break-word",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    {msg.sender}
                  </div>
                  <div>{msg.text}</div>
                  <div style={{ fontSize: "0.7rem", color: "#555", textAlign: "right" }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
            {/* Scroll marker */}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={sendMessage} style={inputContainerStyles}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "15px", // Increased padding for a larger input area
              borderRadius: "25px",
              border: "1px solid #ccc",
              outline: "none",
              fontFamily: "Poppins, sans-serif",
              fontSize: "1.1rem",
            }}
          />
          <button
            type="submit"
            style={{
              marginLeft: "10px",
              transform: "translateY(-5px)", // Moves the icon button upward slightly
              padding: "10px",
              border: "none",
              backgroundColor: "#358aff",
              color: "#fff",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "50px",
              height: "50px",
            }}
          >
            <SendIcon style={{ fontSize: "1.2rem" }} />
          </button>
        </form>
      </div>
      <ChatbotFAB/>
    </div>
  );
};

export default LiveChat;