import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:3000";
let socket;

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [sender, setSender] = useState('Anonymous');

  useEffect(() => {
    // Connect to Socket.IO server
    socket = io(ENDPOINT);
    socket.on('chat message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('chat message', { sender, text: message });
      setMessage('');
    }
  };

  return (
    <div className="chat-container mt-4">
      <h4 className="text-center">Live Chat</h4>
      {/* Optional input to set sender name */}
      <div className="form-group">
        <label htmlFor="sender">Your Name:</label>
        <input
          type="text"
          id="sender"
          className="form-control"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />
      </div>
      <div
        style={{
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px'
        }}
      >
        {chat.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}: </strong> {msg.text}
            <div style={{ fontSize: '0.8em', color: '#888' }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="form-control"
        />
        <button type="submit" className="btn btn-primary mt-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;