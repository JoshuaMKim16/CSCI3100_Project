import React, { useState } from 'react';
import './Login.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    Axios.post('http://localhost:3000/auth/forgot_password', { email })
      .then(response => {
        if (response.data.status) {
          alert("A verification code has been sent to your email.");
          // Pass the email along to the next step if desired.
          navigate('/reset_password', { state: { email } });
        } else {
          alert("This email is not registered. Please sign up or check your email.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("There was an error processing your request. Please try again.");
      });
  };

  return (
    <div className='sign-up-container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h2>Password Reset</h2>
        <label htmlFor='email'>Email:</label>
        <input
          type='email'
          autoComplete='off'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
};

export default ForgotPassword;