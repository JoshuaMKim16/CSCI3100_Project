import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3000/auth/login', {
      email: email, 
      password: password,
    })
      .then(response => {
        if(response.data.status){
          setMessage("Login successful! Redirecting...");
          setError(''); // Clear any previous error messages
          setTimeout(() => {
            navigate('/tours');
          }, 1500);
        } else {
          setMessage('');
          setError("Invalid username or password.");
        }
      })
      .catch(err => {
        setMessage('');
        setError("Invalid username or password.");
        console.log(err);
      });
  };

  return (
    <div className='sign-up-container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h2>Log in</h2>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <label htmlFor='email'>Email:</label>
        <input 
          type='email' 
          placeholder='Email' 
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor='password'>Password:</label>
        <input 
          type='password' 
          placeholder='******'
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type='submit'>Login</button>
        <p>
          <Link to="/forgotPassword">Forgot Password?</Link>
        </p>
        <p>
          Don't Have An Account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;