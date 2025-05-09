const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server'); 
const User = require('../models/user.model');

describe('License API Endpoints', () => {
  let mongoServer;
  let testUserId;

  // Set up an in-memory MongoDB instance before tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user for license operations
    const testUser = await User.create({
      name: "Test User",
      password: "password123",
      email: "testuser@example.com"
    });
    testUserId = testUser._id;
  });

  // Close connections after all tests
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    server.close();
  });

  // Test case: Update license 
  test('should update license key for a user with a valid key', async () => {
    const licenseKey = "ABCD-EFGH-IJKL-MNOP"; 
    const response = await request(app)
      .put(`/api/license/${testUserId}`)
      .send({ licenseKey });

    expect(response.statusCode).toBe(200);
    expect(response.body.user_subscription).toBe(licenseKey);
  });

  // Test case: Fail to update license when provided an invalid license key
  test('should reject update when license key format is invalid', async () => {
    const invalidLicenseKey = "INVALID-KEY";
    const response = await request(app)
      .put(`/api/license/${testUserId}`)
      .send({ licenseKey: invalidLicenseKey });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/invalid license key format/i);
  });

  // Test case: Unsubscribe a user by deleting the license key
  test('should unsubscribe license (delete license key) for a user', async () => {
    const response = await request(app)
      .delete(`/api/license/${testUserId}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.user_subscription).toBe('');
  });
});