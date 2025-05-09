const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../server');
const User = require('../models/user.model');

let mongoServer;

describe('Auth Routes', () => {

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    await User.init();
  });

  // Clear users collection before each test for isolation
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  // Test case: Successful signup
  it('should allow a new user to sign up', async () => {
    const res = await request(app).post('/auth/signup').send({
      email: 'testuser@example.com',
      password: 'Test12345',
      name: 'Test User'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
  });

  // Test case: Invalid credentials during login
  it('should reject login with invalid credentials', async () => {
    await request(app).post('/auth/signup').send({
      email: 'testuser@example.com',
      password: 'Test12345',
      name: 'Test User'
    });
    const res = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'WrongPassword'
    });

    expect(res.statusCode).toBe(401);
  });

  // Test case: Reject duplicate email during signup
  it('should not allow duplicate email signup', async () => {
    const firstResponse = await request(app).post('/auth/signup').send({
      email: 'duplicate@example.com',
      password: 'Test12345',
      name: 'Original User'
    });
    
    expect(firstResponse.statusCode).toBe(200);
    expect(firstResponse.body.status).toBe(true);
    const duplicateResponse = await request(app).post('/auth/signup').send({
      email: 'duplicate@example.com',
      password: 'Test12345',
      name: 'Duplicate User'
    });
    expect(duplicateResponse.statusCode).toBe(400);
    expect(duplicateResponse.body.message).toBe('Email already exists.');
  });
});