const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const userRoute = require('./routes/user.route.js');
const commentRoute = require('./routes/comment.route.js');
const locationRoute = require('./routes/location.route.js');
const authRoute = require('./routes/auth.route.js');
const licenseRoutes = require('./routes/licenseRoutes.js');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes.js');
const AIchatRoutes = require('./routes/AIchatRoutes.js');
const adminRoute = require('./routes/admin.route.js');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Model imports
const User = require('./models/user.model.js');
const Location = require('./models/location.model.js');
const Message = require('./models/message.model.js');

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@backenddb.vhwzsyd.mongodb.net/backendDB?retryWrites=true&w=majority&appName=BackendDB`;

// Routes
app.use('/api/users', userRoute);
app.use('/api/comments', commentRoute);
app.use('/api/locations', locationRoute);
app.use('/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/license', licenseRoutes);
app.use('/api/photos', cloudinaryRoutes);
app.use('/', AIchatRoutes);

// Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('chat message', async (msg) => {
    try {
      const newMsg = new Message({
        sender: msg.sender || 'Anonymous',
        text: msg.text,
      });
      await newMsg.save();
      io.emit('chat message', newMsg);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Database connection and server start logic
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log('Connected to database');
      server.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    })
    .catch((error) => {
      console.log('Connection Failed', error);
    });
}

module.exports = { app, server };