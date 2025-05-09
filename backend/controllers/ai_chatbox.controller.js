const fetch = require('node-fetch').default;
require('dotenv').config();

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; 
const MODEL = 'deepseek-chat';
const API_URL = 'https://api.deepseek.com/v1/chat/completions'; 

const chatController = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const requestBody = {
            messages: [
                {
                    content: "You are a very helpful assistant in our program, which is a TravelTailor website application that introduces Hong Kong tourist attractions and restaurants to the users. I want you to form a detailed but concise answer to the user.",
                    role: "system"
                },
                {
                    content: message,
                    role: "user"
                }
            ],
            model: MODEL,
            frequency_penalty: 0,
            max_tokens: 1024, // Originally tested with 2048, but set to 1024 for faster response
            presence_penalty: 0,
            response_format: {
                type: "text"
            },
            stop: null,
            stream: false,
            stream_options: null,
            temperature: 1.3, // general purpose: temperature = 1.3 (from official document)
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
};

module.exports = {
    chatController
};