/////
const request = require('supertest');
const app = require('../index'); // Assuming your express app file is named app.js
const { v4: uuidv4 } = require('uuid');
var session = require('supertest-session');
// const { response } = require('express');

let server;
let testSession;
let authToken;

beforeAll(() => {
  server = app.listen(3002); // Start the server before running any tests
});

beforeEach(() => {
  testSession = session(app);
})

afterAll((done) => {
  server.close(done); // Close the server after all tests are finished
});

const exampleUser = {
    username: 'testuser_' + uuidv4(), // Concatenate a static prefix with a random string
    password: 'ExampleTest123'
};

const goodUser = {
    username: "username123",
    password: "password123",
};

describe('POST /api/signup', () => {
    it('should return 401 if username or password is missing', async () => {
      const incompleteUser = {
        username: exampleUser.username,
      };
      const response = await request(app)
        .post('/api/signup')
        .send(incompleteUser);
      expect(response.statusCode).toBe(401);
    });
    it('should signup a valid user', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send(exampleUser);
      expect(response.statusCode).toBe(200);
    });
});

describe('POST /api/login', () => {
    it('should return 500 if any field is missing', async () => {
      const incompleteUser = {
        username: exampleUser.username,
      };
      const response = await request(app)
            .post('/api/login')
            .send(incompleteUser)
      expect(response.statusCode).toBe(500);
    });
    it('should return 401 if that user does not exist', async () => {
      const badUser = {
        username: "this_user_does_not_exist",
        password: "this_user_does_not_exist",
      };
      const response = await request(app)
            .post('/api/login')
            .send(badUser)
      expect(response.statusCode).toBe(401);
    });
    it('should return 401 if that login is wrong', async () => {
      const badUser = {
        username: exampleUser.username,
        password: "this_user_does_not_exist",
      };
      const response = await request(app)
            .post('/api/login')
            .send(badUser)
      expect(response.statusCode).toBe(401);
    });
    it('should return 200 if that login is successful', async () => {
      const goodUser = {
        username: "username123",
        password: "password123",
      };
      const response = await request(app)
            .post('/api/login')
            .send(goodUser)
      expect(response.statusCode).toBe(200);
    });
});

describe('POST and PUT /api/profile', () => {
  const goodRequest = {
    name: 'John',
    address1: '123 Baker Street',
    address2: 'LDN Apartment 101',
    city    : 'London',
    state   : 'TX',
    zipcode : '77024',
  }
  it('should return 500 if you are not logged in', async () => {
        const response = await request(app)
            .post('/api/profile')
            .send(goodRequest)
        expect(response.statusCode).toBe(401);
  });
  let cookie;
  /* Logging in prior to further testing... */
  beforeAll(async () => {
      const goodUser = {
        username: exampleUser.username,
        password: exampleUser.password,
      };
      const response = await request(app)
            .post('/api/login')
            .send(goodUser)
        cookie = response.headers['set-cookie'];
  })
  it('should return 401 if you are not logged in (post)', async () => {
    const response = await request(app)
          .post('/api/profile')
    expect(response.statusCode).toBe(401);
  });
  it('should return 400 if you send less than 6 keys (post)', async () => {
    const badRequest = {
      name: goodRequest.name,
      address1: goodRequest.address1
    }
    const response = await request(app)
        .post('/api/profile')
        .set('Cookie', cookie) // Include authentication token in headers
        .send(badRequest)
    expect(response.statusCode).toBe(400);
  });
  it('should return 200 if the profile is updated (post)', async () => {
    const response = await request(app)
        .post('/api/profile')
        .set('Cookie', cookie) // Include authentication token in headers
        .send(goodRequest)
    expect(response.statusCode).toBe(200);
  });
  it('should return 401 if you are not logged in (put)', async () => {
    const response = await request(app)
          .put('/api/profile')
    expect(response.statusCode).toBe(401);
  });
  it('should return 400 if you send less than 6 keys', async () => {
    const badRequest = {
      name: goodRequest.name,
      address1: goodRequest.address1
    }
    const response = await request(app)
        .put('/api/profile')
        .set('Cookie', cookie) // Include authentication token in headers
        .send(badRequest)
    expect(response.statusCode).toBe(400);
  });
  it('should return 200 if the profile is updated', async () => {
    const response = await request(app)
        .put('/api/profile')
        .set('Cookie', cookie) // Include authentication token in headers
        .send(goodRequest)
    expect(response.statusCode).toBe(200);
  });
});

/* Done */

describe('GET /api/profile', () => {
  let cookie;
  beforeAll(async () => {
    const goodUser = {
      username: "username123",
      password: "password123",
    };
    const response = await request(app)
          .post('/api/login')
          .send(goodUser)
    cookie = response.headers['set-cookie'];
  })
  it('should return 401 if you are not logged in', async () => {
    const response = await request(app)
          .get('/api/profile')
    expect(response.statusCode).toBe(401);
  });
  it('should return 200 if you are not logged in', async () => {
    const response = await request(app)
          .get('/api/profile')
          .set('Cookie', cookie)
    expect(response.statusCode).toBe(200);
  });
});

/* This one is not working right? */
describe('GET /api/check-history', () => {
  let cookie;
  beforeAll(async () => {
    const goodUser = {
      username: "username123",
      password: "password123",
    };
    const response = await request(app)
          .post('/api/login')
          .send(goodUser)
    cookie = response.headers['set-cookie'];
  })
  it('should return 401 if you are not logged in', async () => {
    const response = await request(app)
          .get('/api/check-history')
    expect(response.statusCode).toBe(401);
  });
  it('should return 200 if you are logged in', async () => {
    const response = await request(app)
          .get('/api/check-history')
          .set('Cookie', cookie)
    expect(response.statusCode).toBe(200);
  });
});

/* Describe */
describe('GET /api/fuel-quote', () => {
  let cookie;
  beforeAll(async () => {
    const goodUser = {
      username: "username123",
      password: "password123",
    };
    const response = await request(app)
          .post('/api/login')
          .send(goodUser)
    cookie = response.headers['set-cookie'];
  })
  it('should return 401 if you are not logged in', async () => {
    const response = await request(app)
          .get('/api/fuel-quote')
    expect(response.statusCode).toBe(401);
  });
  it('should return 200 if you are logged in', async () => {
    const response = await request(app)
          .get('/api/fuel-quote')
          .set('Cookie', cookie)
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /api/check-auth', () => {
  let cookie;
  beforeAll(async () => {
    const goodUser = {
      username: "username123",
      password: "password123",
    };
    const response = await request(app)
          .post('/api/login')
          .send(goodUser)
    cookie = response.headers['set-cookie'];
  })
  it('should return false if you are not logged in', async () => {
    const response = await request(app)
          .get('/api/check-auth')
    expect(response.body.loggedIn).toBe(false)
  });
  it('should return true if you are logged in', async () => {
    const response = await request(app)
          .get('/api/check-auth')
          .set('Cookie', cookie)
    expect(response.body.loggedIn).toBe(true)
  });
});

describe('POST /api/fuel-quote', () => {
  let cookie;
  const date = new Date();
  const goodRequest = {
    gallons : 100,
    deliveryAddress : "1000",
    deliveryDate : '2000-01-12',
    suggestedPrice : 100,
    totalBill : 100
  }
  beforeAll(async () => {
    const goodUser = {
      username: "username123",
      password: "password123",
    };
    const response = await request(app)
          .post('/api/login')
          .send(goodUser)
    cookie = response.headers['set-cookie'];
  })
  it('should return false if you are not logged in', async () => {
    const response = await request(app)
          .post('/api/fuel-quote')
          .send(goodRequest)
    expect(response.statusCode).toBe(401)
  });
  it('should kiss my fucking ass', async () => {
    const response = await request(app)
          .post('/api/fuel-quote')
          .set('Cookie', cookie)
          .send(goodRequest)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Fuel Quote info successfully added!")
  });
});

describe('POST /api/logout', () => {
  let cookie;
  beforeAll(async () => {
    const goodUser = {
      username: "username123",
      password: "password123",
    };
    const response = await request(app)
          .post('/api/login')
          .send(goodUser)
    cookie = response.headers['set-cookie'];
  })
  it('should return success if you are not logged in', async () => {
    const response = await request(app)
          .post('/api/logout')
          .set('Cookie', cookie)
    expect(response.text).toEqual("Successfully logged out.")
  });
});
