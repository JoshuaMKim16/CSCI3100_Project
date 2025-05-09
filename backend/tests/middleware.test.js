const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { adminCheck } = require('../middlewares/admin.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Use a JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

// Create an Express app with two dummy routes:
// One route that is admin-protected, and another route that is for regular users
const app = express();
app.use(express.json());

// Admin route
app.get('/api/admin', authenticateToken, adminCheck, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

// User route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: `Welcome user ${req.user.id}` });
});

describe('Middleware Tests', () => {
  // Admin Route Tests
  describe('Admin Protected Route', () => {
    // Test case: Access should be granted for an admin user
    test('should allow access to admin if token is valid and user is admin', async () => {
      const adminPayload = { id: 'adminid', is_admin: true };
      const token = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: '1h' });
      const response = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Welcome Admin!');
    });

    // Test case: Access should be denied if token is valid but user is not admin
    test('should deny access for non-admin users with valid token on admin route', async () => {
      const nonAdminPayload = { id: 'userId', is_admin: false };
      const token = jwt.sign(nonAdminPayload, JWT_SECRET, { expiresIn: '1h' });
      const response = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toMatch(/Access denied: Admins only./i);
    });

    // Test case: 401 error if no token is provided
    test('should return 401 if no token provided for admin route', async () => {
      const response = await request(app).get('/api/admin');

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('No token provided');
    });

    // Test case: 403 error for an invalid token 
    test('should return 403 for an invalid token on admin route', async () => {
      const response = await request(app)
        .get('/api/admin')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  // Regular User Route Tests
  describe('Authenticated Regular User Route', () => {
    // Test case: A valid token allows a regular user to access 
    test('should allow access to regular user profile if token is valid', async () => {
      const userPayload = { id: 'user123', is_admin: false };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(`Welcome user ${userPayload.id}`);
    });

    // Test case: 401 error for non-existent token 
    test('should return 401 for profile route if no token provided', async () => {
      const response = await request(app).get('/api/profile');
      
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('No token provided');
    });

    // Test case: 403 error for an invalid token 
    test('should return 403 for profile route with an invalid token', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe('Invalid token');
    });
  });
});