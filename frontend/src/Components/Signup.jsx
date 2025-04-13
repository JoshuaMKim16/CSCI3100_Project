import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        // Post to the authentication signup endpoint
        Axios.post('http://localhost:3000/auth/signup', {
            name: username, // using "name" to correspond with the model field
            email, 
            password,
        }).then(response => {
            if(response.data.status){
                setMessage("Signup successful! Redirecting to login page...");
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        }).catch(err => {
            setError("An error occurred. Please try again.");
            console.log(err);
        });
    };

    return (
        <div className='form-container'>
            <form className='form' onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
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
                    <label htmlFor='email'>Email:</label>
                    <input 
                        type='email' 
                        placeholder='Email'
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type='submit' className="btn primary-btn">Sign Up</button>
            </form>
        </div>
    )
}

export default Signup;