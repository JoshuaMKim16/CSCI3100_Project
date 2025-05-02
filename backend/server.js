const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.route.js');
const commentRoute = require('./routes/comment.route.js');
const locationRoute = require('./routes/location.route.js');
const fetch = require('node-fetch').default;
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, '../front_end')));

// Import Models (for reference)
const User = require('./models/user.model.js');
const Location = require('./models/location.model.js');

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// .env file configuration
const dotenv = require('dotenv');
dotenv.config();

// print environment variables for debugging
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@backenddb.vhwzsyd.mongodb.net/backendDB?retryWrites=true&w=majority&appName=BackendDB`;

// Routes configuration
app.use("/api/users", userRoute);
app.use("/api/comments", commentRoute);
app.use("/api/locations", locationRoute);

app.get('/', (req, res) => {
    res.send('Hello from Node Server Updated');
});

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; 
const MODEL = 'deepseek-chat';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const requestBody = {
            messages: [
                {
                    content: "You are a helpful assistant. use english all the time. You are responsible for introducing tourist attractions to the users.",
                    role: "system"
                },
                {
                    content: message,
                    role: "user"
                }
            ],
            model: MODEL,
            frequency_penalty: 0,
            max_tokens: 2048,
            presence_penalty: 0,
            response_format: {
                type: "text"
            },
            stop: null,
            stream: false,
            stream_options: null,
            temperature: 1,
            top_p: 1,
            tools: null,
            tool_choice: "none",
            logprobs: false,
            top_logprobs: null
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DeepSeek API error message returned:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const answer = data.choices[0].message.content.trim();
        res.json({ answer });
    } catch (error) {
        if (error.code === 'ENOTFOUND') {
            console.error('Network error: Unable to resolve the domain name of api.deepseek.com, please check the network connection and DNS settings');
        } else {
            console.error('DeepSeek API Error:', error);
        }
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Connect to MongoDB and start the server
mongoose.connect(connectionString)
   .then(() => {
        console.log('Connected to database');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
   .catch((error) => {
        console.log('Connection Failed', error);
    });    