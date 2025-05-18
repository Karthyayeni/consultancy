const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('GET /api/customers', () => {
  it('should return a list of customers and print the response', async () => {
    const res = await request(app).get('/api/customers');
    console.log('Response body:', res.body); 
  });
});

afterAll(async () => {
  // ✅ Close Mongoose connection
  await mongoose.connection.close();

  // ✅ Close the server if it was started manually
  if (server && server.close) {
    await server.close();
  }
});
