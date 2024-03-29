/////
const request = require('supertest');
const app = require('../index'); // Assuming your express app file is named app.js
var session = require('supertest-session');
// const { response } = require('express');

// Mock session middleware
// const mockSession = {
//   user: {
//     username: 'Jason',
//     id: 1, // Mock user id
//   },
// };

// app.use((req, res, next) => {
//   req.session = mockSession;
//   next();
// });

// var testSession = session;
// beforeEach(function () {
//   testSession = session(app);
// });

// var testSession = session(app, {
//   before: function (req) {
//     req.set('id', '1234');
//   }
// });

let server;

beforeAll(() => {
  server = app.listen(3002); // Start the server before running any tests
});

afterAll((done) => {
  server.close(done); // Close the server after all tests are finished
});

describe('POST /api/user', () => {
  it('rejects on bad login', async () => {
    const response = await request(app)
          .post("/api/user")
          .send({username: 'janedoe'})
          .expect(401)
          // .expect('Content-Type', /json/)
  });
  it('rejects on invalid login', async () => {
    const response = await request(app)
          .post("/api/user")
          .send({username: 'janedoe', password: 'jane'})
          .expect(401)
  });
  it('accepts valid login', async () => {
    const response = await request(app)
          .post("/api/user")
          .send({username: 'janedoe', password: 'john'})
          .expect(200)
  });
});


describe('GET /api/fuel', () => {
  it('should return fuel quote history for the user', async () => {
    const response = await request(app)
          .get("/api/fuel")
          .expect(200)
          .expect('Content-Type', /json/)
  });
});


describe('GET /api/db', () => {
  test('should return the current db', async () => {
    const response = await request(app).get("/api/db")
                                       .expect(200)
                                       .expect('Content-Type', /json/);
  });
});
