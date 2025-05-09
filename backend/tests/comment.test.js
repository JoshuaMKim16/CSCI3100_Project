const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server'); 
const Comment = require('../models/comment.model');

describe('Comment API Endpoints', () => {
  let mongoServer;
  let testCommentId;
  
  // Set up an in-memory MongoDB instance before tests.
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Close server connections after all tests.
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    server.close();
  });

  // Test case: create a new comment 
  test('should create a new comment', async () => {
    const newComment = {
      content: "This is a test comment",
      author: "681e13e8633b026ed53771bc",            
      location: "6813da1d31c3883804ea67c6"    
    };

    const response = await request(app)
      .post('/api/comments')
      .send(newComment);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.content).toBe(newComment.content);
    testCommentId = response.body._id;
  });

  // Test case: fetch all comments 
  test('should get all comments', async () => {
    const response = await request(app).get('/api/comments');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test case: update an existing comment 
  test('should update an existing comment', async () => {
    const updatedData = { content: "Updated test comment content" };
    const response = await request(app)
      .put(`/api/comments/${testCommentId}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(updatedData.content);
  });

  // Test case: like a comment 
  test('should like a comment', async () => {
    const response = await request(app)
      .post(`/api/comments/${testCommentId}/like`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.likes).toBeGreaterThanOrEqual(1);
  });

  // Test case: dislike a comment
  test('should dislike a comment', async () => {
    const response = await request(app)
      .post(`/api/comments/${testCommentId}/dislike`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.dislikes).toBeGreaterThanOrEqual(1);
  });

  // Test case: delete the comment
  test('should delete the comment', async () => {
    const response = await request(app)
      .delete(`/api/comments/${testCommentId}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/deleted successfully/i);
  });
});