const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.route.js');
const commentRoute = require('./routes/comment.route.js');
const app = express();

// Import Models (for reference)
const User = require('./models/user.model.js');
// The site model is imported as "Site" from the location.model.js file
const Site = require('./models/location.model.js');

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// .env file configuration
const dotenv = require('dotenv');
dotenv.config();
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@backenddb.vhwzsyd.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB`;

// Routes configuration
app.use("/api/users", userRoute);
app.use("/api/comments", commentRoute);

app.get('/', (req, res) => {
    res.send('Hello from Node Server Updated');
});

// Connect to MongoDB and start the server
mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to database');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(() => {
        console.log('Connection Failed');
    });