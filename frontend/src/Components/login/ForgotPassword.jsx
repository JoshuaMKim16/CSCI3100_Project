import React, { useState } from 'react';
import './Login.css'; // Reuse styling from the login page
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress'; // Material-UI Spinner
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Material-UI Back Arrow Icon

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    Axios.post('http://localhost:3000/auth/forgot_password', { email })
      .then(response => {
        setLoading(false); // Stop loading spinner
        if (response.data.status) {
          alert("A verification code has been sent to your email.");
          navigate('/reset_password', { state: { email } });
        } else {
          alert("This email is not registered. Please sign up or check your email.");
        }
      })
      .catch(err => {
        setLoading(false); // Stop loading spinner
        console.error(err);
        alert("There was an error processing your request. Please try again.");
      });
  };

  return (
    <div
      className='body'
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
        <source src={require('./LogInVideo.mp4')} type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      {/* Forgot Password Form */}
      <div
        className='signup-container'
        style={{
          zIndex: 1,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        <form
          className='signup-form'
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '30px',
            borderRadius: '50px',
            width: '350px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
            position: 'relative',
          }}
        >
          {/* Back Arrow */}
          <div
            className="back-arrow"
            style={{
              position: 'absolute', // Position the arrow inside the form
              top: '23px', // Adjust top position
              left: '23px', // Adjust left position
              cursor: 'pointer',
              zIndex: 3, // Ensure it appears above the form content
            }}
            onClick={() => navigate('/login')} // Navigate to the home page or desired route
          >
            <ArrowBackIcon style={{ color: 'black', fontSize: '28px' }} /> {/* Black arrow */}
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Password Reset</h2>

          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            autoComplete='off'
            placeholder='Enter your email'
            value={email}
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

          {/* Send Button with Spinner */}
          <button
            type='submit'
            disabled={loading} // Disable button while loading
            style={{
              width: '100%',
              backgroundColor: loading ? '#b0bec5' : 'skyblue', // Change color when loading
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '15px',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer', // Prevent clicks while loading
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'background-color 0.3s',
            }}
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: 'white' }} /> // Spinner
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;