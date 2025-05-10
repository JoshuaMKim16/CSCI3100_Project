import React, { useState, useContext, useEffect, useRef } from 'react';
import './Login.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    // Set playback rate to 0.6x when the component mounts
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    Axios.post('http://localhost:3000/auth/login', { email, password })
      .then((response) => {
        if (response.data.status) {
          const userData = { ...response.data.user, token: response.data.token };

          // Persist user data in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          Axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
          setUser(userData);

          setMessage('Login successful! Redirecting...');
          setError('');

          // Redirect based on role
          if (userData.is_admin) {
            setTimeout(() => {
              navigate('/admin');
            }, 1500);
          } else {
            setTimeout(() => {
              navigate('/main');
            }, 1500);
          }
        } else {
          setMessage('');
          setError('Invalid email or password.');
        }
      })
      .catch((err) => {
        setMessage('');
        setError('Invalid email or password.');
        console.error(err);
      });
  };

  return (
    <div className="body" style={{ fontFamily: 'Poppins, sans-serif', position: 'relative', height: '100vh', overflow: 'hidden' }}>
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
        }}
      >
        TravelTailor
      </div>

      {/* Login Form */}
      <div className="login-container" style={{ zIndex: 1, position: 'relative' }}>
        <form
          className="login-form"
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '30px',
            borderRadius: '50px',
            width: '350px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
            zIndex: 2,
            position: 'relative', // Ensures absolute children are positioned within the form
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
              onClick={() => navigate('/')}
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

          <h2 style={{ textAlign: 'center', marginBottom: '10px', marginTop: '30px' }}>Log in</h2>

          {message && <div className="success-message" style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>{message}</div>}
          {error && <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
          
          {/* Content of the log in form */}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Email"
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

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            className="login-button"
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
            Login
          </Button>

          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            <Button
              variant="text"
              onClick={() => navigate('/forgotPassword')}
              style={{ fontSize: '14px', color: 'skyblue', textTransform: 'none' }}
            >
              Forgot Password?
            </Button>
          </p>
          <p style={{ textAlign: 'center' }}>
            Don't Have An Account?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/signup')}
              style={{ fontSize: '14px', color: 'skyblue', textTransform: 'none', fontWeight: 'bold' }}
            >
              Sign Up
            </Button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;