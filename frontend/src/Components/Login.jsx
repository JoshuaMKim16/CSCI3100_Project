import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.get('http://localhost:3001/api/auth/login', {
            email: email, 
            password: password,
        }).then(response => {
            if(response.data.status){
                setMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate('/tours');
                }, 1500);
            }
        }).catch(err => {
            setError("Invalid username or password.");
            console.log(err);
        });
    };

    return (
        <div className='sign-up-container'>
            <form className='sign-up-form'onSubmit={handleSubmit}>
                <h2>Log in</h2>
                <label htmlFor='email'>Email:</label>
                <input type='email' placeholder='Email' 
                onChange={(e) => setEmail(e.target.value)}/>

                <label htmlFor='password'>Password:</label>
                <input type='password' placeholder='******'
                onChange={(e) => setPassword(e.target.value)}/>

                <button type='Submit'>Login</button>
                <p><Link to = "/forgotPassword">Forgot Password?</Link></p>
                <p>Don't Have An Account? <Link to ="/signup">Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;