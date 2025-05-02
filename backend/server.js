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

const { chatController } = require('./controllers/ai_chatbox.controller.js');

// use the chatController for the /chat endpoint
app.post('/chat', chatController);

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