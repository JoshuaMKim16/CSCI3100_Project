import React, { useState } from "react";
import {
  Fab,
  Dialog,
  IconButton,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am the AI bot of TravelTailor. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user's message to the chat history.
    const newMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Add a placeholder message.
    const thinkingMessage = { sender: "ai", text: "Chatbot is thinking..." };
    setMessages((prev) => [...prev, thinkingMessage]);

    setLoadingResponse(true);

    try {
      // API call to your chatbot backend.
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage.text }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      const answer = data.answer || "Sorry, I did not understand that.";

      // Remove the placeholder.
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "Chatbot is thinking...")
      );
      // Append API answer.
      setMessages((prev) => [...prev, { sender: "ai", text: answer }]);
    } catch (error) {
      console.error("Error during chatbot API call:", error);
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "Chatbot is thinking...")
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "An error occurred while processing your request.",
        },
      ]);
    } finally {
      setLoadingResponse(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Chat messages container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden", // prevent horizontal scrolling
          p: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          mb: 2,
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
              overflowX: "hidden",
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: "8px",
                backgroundColor:
                  msg.sender === "user" ? "#cce4ff" : "#e0e0e0",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Chat input area */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          overflowX: "hidden",
        }}
      >
        {/* Expanded Input */}
        <TextField
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            sx: { fontSize: "1rem", height: "40px" }, 
          }}
        />
        {/* Smaller Send Button */}
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{
            width: "50px",
            padding: "4px 6px",
            fontSize: "0.75rem",
            height: "40px", 
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

const ChatbotFAB = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      {/* Floating Action Button positioned at the lower-right (with some offset) */}
      <Fab
        color="primary"
        aria-label="chatbot"
        onClick={handleToggle}
        sx={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chatbot Dialog */}
      <Dialog
        open={open}
        onClose={handleToggle}
        PaperProps={{
          style: {
            position: "fixed",
            bottom: "100px",
            right: "50px",
            margin: 0,
            width: "350px",
            height: "500px",
            overflow: "hidden", // Prevent extra scrolling
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "1rem" }}>
              TravelTailor Chatbot
            </Typography>
            <IconButton
              onClick={handleToggle}
              sx={{
                width: "24px",
                height: "24px",
                p: 0,
                minWidth: "unset",
              }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </Box>
          {/* Chatbot content */}
          <Box sx={{ flex: 1, p: 1, overflow: "hidden" }}>
            <AIChatbot />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ChatbotFAB;
