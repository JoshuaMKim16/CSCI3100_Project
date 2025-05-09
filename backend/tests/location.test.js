const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server'); 
const Location = require('../models/location.model');

describe('Location API Endpoints', () => {
  let mongoServer;
  let testLocationId;

  // Set up an in-memory MongoDB instance before all tests run.
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Close connections after all tests.
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    server.close();
  });

  // Test case: Create a new location 
  test('should create a new location', async () => {
    const newLocation = {
      name: "Test Location",
      location: [12.34, 56.78],
      address: "123 Test Street",
      opening_hour: [9, 18],
      price: 100,
      description: "A beautiful test location",
      type: ["park"],
      picture: ["https://example.com/test.jpg"]
    };

    const response = await request(app)
      .post('/api/locations')
      .send(newLocation);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newLocation.name);
    testLocationId = response.body._id;
  });

  // Test case: Retrieve all locations 
  test('should get all locations', async () => {
    const response = await request(app).get('/api/locations');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test case: Retrieve a single location by id 
  test('should get a location by id', async () => {
    const response = await request(app).get(`/api/locations/${testLocationId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', testLocationId);
  });

  // Test case: Update a location 
  test('should update a location by id', async () => {
    const updatedData = { name: "Updated Test Location" };
    const response = await request(app)
      .put(`/api/locations/${testLocationId}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
  });

  // Test case: Delete the location 
  test('should delete the location by id', async () => {
    const response = await request(app)
      .delete(`/api/locations/${testLocationId}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/deleted successfully/i);
  });
});