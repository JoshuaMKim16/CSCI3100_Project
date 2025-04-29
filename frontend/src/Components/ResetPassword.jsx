import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // If you want, you can add additional password validation here (such as min length, etc.)

    Axios.post('http://localhost:3000/auth/reset_password', {
      email,
      code,
      newPassword,
    })
      .then(response => {
        if (response.data.status) {
          alert("Your password has been updated successfully!");
          navigate('/login');
        } else {
          alert("The verification code is invalid or has expired. Please try again.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("The verification code does not match. Please try again.");
      });
  };

  return (
    <div className='sign-up-container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
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
        />

        <label htmlFor='newPassword'>New Password:</label>
        <input
          type='password'
          autoComplete='new-password'
          placeholder='Enter your new password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type='submit'>Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;