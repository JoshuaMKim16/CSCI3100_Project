import React, {useState} from 'react';
import '../App.css';
import Axios from 'axios';
import {Link, useNavigate} from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:3000/auth/forgot_password', {
            email, 
        }).then(response => {
            if(response.data.status){
                alert("Check your email for the password reset link")
                navigate('/login')
            }
        }).catch(err => {
            console.log(err)
        })

    }

    return(
        <div className='sign-up-container'>
        <form className='sign-up-form'onSubmit={handleSubmit}>
            <h2>Password Reset</h2>
           
            <label htmlFor='email'> Email:</label>
            <input type='email' autoComplete='off' placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}/>

            <button type='Submit'>Send</button>
        </form>
    </div>
    )
}
export default ForgotPassword;