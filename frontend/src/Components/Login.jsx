import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        // Post to the authentication login endpoint
        Axios.post('http://localhost:3000/auth/login', {
            username, 
            password,
        }).then(response => {
            if(response.data.status){
                setMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            }
        }).catch(err => {
            setError("Invalid username or password.");
            console.log(err);
        });
    };

    return (
        <div className='form-container'>
            <form className='form' onSubmit={handleSubmit}>
                <h2>Log In</h2>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor='username'>Username:</label>
                    <input 
                        type='text' 
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor='password'>Password:</label>
                    <input 
                        type='password' 
                        placeholder='******'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type='submit' className="btn primary-btn">Login</button>
                <p>
                    Don't Have An Account? <Link to="/signup" className="link">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;