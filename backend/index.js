const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const userRoute = require('./routes/user.route.js')
const app = express()
app.use(cors())

// Import Models
const User = require('./models/user.model.js')
const Location = require('./models/location.model.js')

// Middleware configureation
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// .env file configuration
const dotenv = require('dotenv')
dotenv.config();
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@backenddb.vhwzsyd.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB`;

// routes
app.use("/api/users", userRoute)

app.get('/', (req, res) => {
    res.send('Hello from Node Server Updated')
});

mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to database');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(() => {
        console.log('Connection Failed')
    })
