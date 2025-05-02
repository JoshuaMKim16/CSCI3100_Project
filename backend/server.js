const express = require('express');
const fetch = require('node-fetch').default;
const app = express();
const port = 3000;
const cors = require('cors');
// Import dotenv and configure it to load environment variables from a .env file
require('dotenv').config();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('.'));

// Get the DeepSeek official website API key and model from the environment variables
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
            console.error('DeepSeek API Returned error message:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const answer = data.choices[0].message.content.trim();
        res.json({ answer });
    } catch (error) {
        if (error.code === 'ENOTFOUND') {
            console.error('Network error: Unable to resolve the domain name of api.deepseek.com, please check your network connection and DNS settings.');
        } else {
            console.error('DeepSeek API Error:', error);
        }
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});