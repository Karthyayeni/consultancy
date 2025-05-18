const request = require('supertest');
const app = require('../server');

describe('GET /api/customers', () => {
  it('should return a list of customers and print the response', async () => {
    const res = await request(app).get('/api/customers');
    console.log('Response body:', res.body); 
  });
});

describe('GET /api/orders/all', () => {
  it('should return a list of orders and print the response', async () => {
    const res = await request(app).get('/api/orders/all');
    console.log('Response body:', res.body);  // Print the orders array with populated user details
  });
});
