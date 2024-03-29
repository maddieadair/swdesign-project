/////
const request = require('supertest');
const app = require('../index'); // Assuming your express app file is named app.js
var session = require('supertest-session');
// const { response } = require('express');


let server;

beforeAll(() => {
  server = app.listen(3002); // Start the server before running any tests
});

beforeEach(() => {
  testSession = session(app);
})

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
  var authenticatedSession;

  beforeEach((done) => {
    testSession.post("/api/user")
               .send({username: 'janedoe', password: 'john'})
               .expect(200)
               .end(function(err) {
                 if (err) return done(err);
                 authenticatedSession = testSession;
                 return done();
               })
  });

  it('should return fuel quote history for the user', async () => {
    const response = await authenticatedSession.get("/api/fuel")
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

describe('POST /api/profile', () => {
  var authenticatedSession;

  beforeEach((done) => {
    testSession.post("/api/user")
               .send({username: 'janedoe', password: 'john'})
               .expect(200)
               .end(function(err) {
                 if (err) return done(err);
                 authenticatedSession = testSession;
                 return done();
               })
  });

  it('should update if the profile is valid', async () => {
    const response = await authenticatedSession.post("/api/profile")
                                               .send({name: 'Jake Doe', address: { state : "Texas", city : "Houston", zipcode : "40100", address1 : "123 Sample Street", address2: "" }})
          .expect(200)
          .expect('Content-Type', /json/)
  });

  it('should fail to update if name or address is missing', async () => {
  const response = await authenticatedSession.post("/api/profile")
                                             .send({name: 'Jake Doe'})
          .expect(400)
          .expect('Content-Type', /json/)
  });
});

describe('POST /api/signup', () => {
  // var authenticatedSession;

  it('should fail when user already exists', async () => {
    const response = await request(app)
          .post("/api/signup")
          .send({username: 'janedoe', password: 'example'})
          .expect(400)
  });

  it('should fail when the username is invalid', async () => {
    const response = await request(app)
          .post("/api/signup")
          .send({username: '??', password: 'example'})
          .expect(400)
  });
  it('should get back a new user on success', async () => {
    const response = await request(app)
          .post("/api/signup")
          .send({username: 'example', password: 'example'})
          .expect(200)
  });
});
