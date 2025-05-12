import React, { useState } from 'react';
import './Login.css'; 
import Axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Reset password general logic
const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state for the button

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    Axios.post('http://localhost:3000/auth/reset_password', {
      email,
      code,
      newPassword,
    })
      .then(response => {
        setLoading(false); // Stop loading spinner
        if (response.data.status) {
          alert("Your password has been updated successfully!"); // Reset Password success
          navigate('/login');
        } else {
          alert("The verification code is invalid or has expired. Please try again."); // Failed due to invalid verification code
        }
      })
      .catch(err => {
        setLoading(false); // Stop loading spinner
        console.error(err);
        alert("The verification code does not match. Please try again."); // Failed due to the wrong verification code
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

      {/* Reset Password Form */}
      <div
        className='login-container'
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
          className='login-form'
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
              position: 'absolute', 
              top: '20px', 
              left: '25px', 
              cursor: 'pointer',
              zIndex: 3, 
            }}
            onClick={() => navigate('/forgotPassword')} 
          >
            <ArrowBackIcon style={{ color: 'black', fontSize: '28px' }} /> 
          </div>
            
          {/* Content of the password reset form */}
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</h2>

          {/* If email is not provided from the previous step, ask for it */}
          {!email && (
            <>
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
            </>
          )}
          <label htmlFor='code'>Verification Code:</label>
          <input
            type='text'
            autoComplete='off'
            placeholder='Enter the verification code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
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

          <label htmlFor='newPassword'>New Password:</label>
          <input
            type='password'
            autoComplete='new-password'
            placeholder='Enter your new password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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

          {/* Reset Password Button */}
          <button
            type='submit'
            disabled={loading} // Disable button while loading
            style={{
              width: '100%',
              backgroundColor: loading ? '#b0bec5' : 'skyblue', // Gray when loading
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
              <div
                style={{
                  border: '2px solid white', // Spinner border color
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  animation: 'spin 1s linear infinite',
                }}
              ></div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;