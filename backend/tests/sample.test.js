const request = require('supertest');
const server = require('../server');
const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();

  if (server && server.close) {
    await new Promise((resolve, reject) => {
      server.close(err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
});

describe('GET /api/customers', () => {
  it('should return a list of customers and print the responses', async () => {
    const res = await request(server).get('/api/customers');
    console.log('Response body:', res.body);
  });
});

