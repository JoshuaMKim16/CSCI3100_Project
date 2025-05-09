import React, { useState, useRef, useEffect } from 'react';
import './Login.css'; // Reuse your CSS styles
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Adjust playback rate for the background video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    Axios.post('http://localhost:3000/auth/signup', {
      name: username,
      email: email,
      password: password,
      adminCode: adminCode
    })
      .then(response => {
        setLoading(false);
        if (response.data.status) {
          setMessage("Sign up successful! Redirecting...");
          setError('');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setMessage('');
          setError("Sign up failed. Already a user?");
        }
      })
      .catch(err => {
        setLoading(false);
        setMessage('');
        setError("Sign up failed. Already a user?");
        console.error(err);
      });
  };

  return (
    <div
      className="body"
      style={{
        fontFamily: 'Poppins, sans-serif',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src={require('./LogInVideo.mp4')} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Cursive TravelTailor Title in Top Left */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontFamily: 'cursive',
          fontSize: '32px',
          color: 'black',
          zIndex: 2,
          cursor: 'pointer'
        }}
        onClick={() => navigate("/")}
      >
        TravelTailor
      </div>

      {/* Signup Form Container */}
      <div
        className="signup-container"
        style={{
          zIndex: 1,
          position: 'relative',
          marginTop: '120px', // adjust to ensure the form doesn't overlap the header
        }}
      >
        <form
          className="signup-form"
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '30px',
            borderRadius: '50px',
            width: '400px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
            zIndex: 2,
            position: 'relative',
            margin: 'auto',
          }}
        >
          {/* Back Arrow */}
          <div
            className="back-arrow"
            style={{
              position: 'absolute',
              top: '17px',
              left: '20px',
              cursor: 'pointer',
              zIndex: 3,
            }}
          >
            <Button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'black',
                textTransform: 'none',
                fontSize: '16px',
              }}
            >
              <ArrowBackIcon style={{ marginRight: '5px' }} /> Back
            </Button>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '10px', marginTop: '30px' }}>Sign Up</h2>

          {message && (
            <div
              className="success-message"
              style={{
                color: 'green',
                textAlign: 'center',
                marginBottom: '10px'
              }}
            >
              {message}
            </div>
          )}
          {error && (
            <div
              className="error-message"
              style={{
                color: 'red',
                textAlign: 'center',
                marginBottom: '10px'
              }}
            >
              {error}
            </div>
          )}

          {/* Username Field */}
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />

          {/* Email Field */}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />

          {/* Password Field */}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />

          {/* Admin Code Field */}
          <label htmlFor="adminCode">Admin Code (if applicable):</label>
          <input
            type="text"
            placeholder="Enter admin code"
            onChange={(e) => setAdminCode(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            style={{
              width: '100%',
              backgroundColor: 'skyblue',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '15px',
              padding: '12px',
            }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            Already have an account?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              style={{
                fontSize: '14px',
                color: 'skyblue',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Log In
            </Button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;