const request = require('supertest');
const { sequelize } = require('../config/db');
const app = require('../server');  // Import Express app
const { User } = require('../models/userModel');

beforeAll(async () => {
  await sequelize.authenticate(); // Ensure the DB connection is successful
  await sequelize.sync({ force: true }); // Clear the database before running tests
});

afterAll(async () => {
  await sequelize.close(); // Close the DB connection after tests
});




describe('GET /api/users', () => {
  it('should return a list of users', async () => {
    // Insert a test user into the DB
    await User.create({ username: 'john_doe', email: 'john@example.com', password: 'hashed' });

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body[0].username).toBe('john_doe');
  });
});
