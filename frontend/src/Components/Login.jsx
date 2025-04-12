import React, {useState} from 'react';
import '../App.css';
import Axios from 'axios';
import {Link, useNavigate} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:3000/auth/login', {
            username, 
            password,
        }).then(response => {
            if(response.data.status){
                navigate('/home')
            }
        }).catch(err => {
            console.log(err)
        })

    }

    return (
        <div className='sign-up-container'>
            <form className='sign-up-form'onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <label htmlFor='username'>Username:</label>
                <input type='text' placeholder='Username' 
                onChange={(e) => setUsername(e.target.value)}/>

                <label htmlFor='password'>Password:</label>
                <input type='password' placeholder='******'
                onChange={(e) => setPassword(e.target.value)}/>

                <button type='Submit'>Login</button>
                <p>Don't Have An Account? <Link to ="/signup">Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;
