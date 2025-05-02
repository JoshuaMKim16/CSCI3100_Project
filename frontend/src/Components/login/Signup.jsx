import React, { useState } from 'react';
import './Login.css';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');  // New state for admin code
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3000/auth/signup', {
            name: username, 
            email: email, 
            password: password,
            adminCode: adminCode  // Send the admin code
        })
        .then(response => {
            if(response.data.status){
                navigate('/login');
            }
        })
        .catch(err => {
            setMessage('');
            setError("An error occurred. Please try again.");
            console.log(err);
        });
    };

    return (
        <div className='signup-container'>
            <form className='signup-form' onSubmit={handleSubmit}>
                <h2>Sign Up</h2>

                <label htmlFor='username'>Username:</label>
                <input 
                    type='text'
                    placeholder='Username' 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor='email'>Email:</label>
                <input 
                    type='email'
                    autoComplete='off'
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

                <label htmlFor='adminCode'>Admin Code (if applicable):</label>
                <input 
                    type='text'
                    placeholder='Enter admin code'
                    onChange={(e) => setAdminCode(e.target.value)}
                />

                <button type='submit'>Sign Up</button>
                <p>Have an Account? <Link to='/login'>Login</Link></p> 
            </form>
        </div>
    )
}

export default Signup;