import React, { useState, useContext } from 'react';
import './Login.css';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../utils/AuthContext';


const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3000/auth/login', { email, password })
      .then(response => {
        if (response.data.status) {
          const userData = response.data.user;
          // Persist user information in localStorage for session persistence.
          localStorage.setItem('user', JSON.stringify(userData));
          // Update the context with the user data.
          setUser(userData);

          setMessage("Login successful! Redirecting...");
          setError('');
          
          // Redirect based on user role (admin or regular user)
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
          setError("Invalid email or password.");
        }
      })
      .catch(err => {
        setMessage('');
        setError("Invalid email or password.");
        console.log(err);
      });
  };

  return (
    <div className='body'>
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Login;