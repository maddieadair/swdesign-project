const express = require('express');
const session = require('express-session')
const cors = require('cors');

const port = 3001
const app = express();
const cookieParser = require('cookie-parser');
app.set('trust proxy', 1)

app.use(express.json());
app.use(cors({credentials: true}))
app.use(session({
  secret: 'C9IPUj0IEPlMV1Id',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 30000 * 60},
  secure: false
}))
MyUsers = [
    {
        "id": 0,
        "name": "John Doe",
        "username": "johndoe",
        "password": "jane",
        "address": {
            "state": "Texas",
            "city": "Houston",
            "zipcode": "40170",
            "address1": "123 Sample Street",
            "address2": "Town, USA 12345"
        }
    },
    {
        "id": 1,
        "name": "Jane Doe",
        "username": "janedoe",
        "password": "john",
        "address": {
            "state": "Texas",
            "city": "Houston",
            "zipcode": "40170",
            "address1": "123 Sample Street",
            "address2": "Town, USA 12345"
        }
    }
]
MyFuelQuoteHistory = [
    {
      "id": 0,
      "History" : [
      {
          gallons: 100,
          address: "123 Baker Street",
          date: "9-14-23",
          price: 400.0,
          total_amt: 450.0,
      },
      {
          gallons: 90,
          address: "123 Baker Street",
          date: "9-14-23",
          price: 400.0,
          total_amt: 450.0,
      },
      {
          gallons: 80,
          address: "123 Baker Street",
          date: "9-14-23",
          price: 400.0,
          total_amt: 450.0,
      },
      {
          gallons: 70,
          address: "123 Baker Street",
          date: "9-14-23",
          price: 400.0,
          total_amt: 450.0,
      },
      {
          gallons: 60,
          address: "123 Baker Street",
          date: "9-14-23",
          price: 400.0,
          total_amt: 450.0,
      },
      {
          gallons: 50,
          address: "123 Baker Street",
          date: "9-14-23",
          price: 400.0,
          total_amt: 450.0,
      },
      {
          gallons: 40,
          address: "123 Baker Street",
          date: "9-14-23",
          price: 400.0,
          total_amt: 450.0,
      }
    ]
    }
]

app.post('/api/user', (req, res) => {
  const { username, password } = req.body;
  console.log("We've received a username and password!");
  if (username && password) {
    // console.log(req.session);
    // console.log(req.session.id);
    // NOTE This is a sample implementation. No hashing is implemented.
    const myID = MyUsers.findIndex(user => user.username === username && user.password === password);
    if (myID != -1) {
      req.session.save(() => {
        req.session.authenticated = true;
        req.session.loggedIn = true;
        req.session.user = {
          id: MyUsers[myID].id,
          username: MyUsers[myID].username
        }
      console.log(req.session);
      res.json(req.session)
      })
    }
    else {
      res.status(401).json({ error: 'Invalid credentials' })
      console.log("Invalid login:" + username + " " + password);
    }
  }
  else {
    res.status(401).json({ error: 'Invalid credentials' });
    console.log("Invalid login.");
  }
})

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body
  console.log("We got a request!");

  const user = MyUsers.find(user => user.username === username);
  if (user) {
    console.log("Invalid login." + username);
    return res.status(400).json({ error: 'User already exists.' });
  }
  else if (!/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(username)) {
    console.log("Invalid credentials." + username);
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const id = MyUsers.length;
  var newUser = {
      id: id,
      username: username,
      password: password,
  };
  MyUsers.push(newUser);
  req.session.save(() => {
    req.session.authenticated = true;
    req.session.loggedIn = true;
    req.session.user = newUser;
    console.log("Our newly made user is: ")
    console.log(req.session);
    console.log("-----------------------------------")
    res.json(req.session.user)
  })
  // req.session("HELP");
  // console.log("Our newly made user is: ")
  // console.log(req.session)
  // res.json(req.session);
})

app.post('/api/profile', (req, res) => {
  const {name, address} = req.body;
  if (!name || !address) {
    return res.status(400).json({ error: 'Name and address are required parameters.' });
  }
  console.log(req.session);
  // console.log("The user" + req.session.user.username + " is at loc");
  const uid = MyUsers.findIndex(user => user.username === req.session.user.username);
  if (uid === -1) {
    return res.status(404).json({ error: 'Could not find that user'})
  }
  MyUsers[uid].name = name;
  MyUsers[uid].address = address;
  res.json({ loggedIn: true, user: req.session.user });
})

app.get('/api/db', (req, res) => {
  res.json(MyUsers);
})

app.get('/api/check-auth', (req, res) => {
  console.log("Analyzing if this user is authenticated:");
  console.log(req.session);
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  }
  else {
    res.json({ loggedIn: false });
  }
})

app.get('/api/fuel', (req, res) => {
  console.log(req.session.user)
  const id = req.session.user.id
  var fuelQuoteHistory = MyFuelQuoteHistory.find(hist => id === hist.id)
  if (!fuelQuoteHistory) {
    console.log("ID " + id + " not found; Creating a new entry.");
    fuelQuoteHistory = {
      "id" : id,
      "History" : []
    }
    MyFuelQuoteHistory.push(fuelQuoteHistory);
  }
  res.json(fuelQuoteHistory);
})

app.post('/api/logout', (req, res) => {
  console.log("Request to logout from: " + req.session)
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session: ', err);
      res.sendStatus(500);
    }
  })
  res.send("Successfully logged out.")
})

if (require.main === module) {
  app.listen(port, () => {
    console.log('server listening on port ' + port)
  });
}

module.exports = app

/* Signup -> Test if username and are empty */
/* Login -> Test if username and password are empty */
/*  -> Test if username and password are empty */

/* bcrypt.hash(password, saltRounds, (err, hash) => {
 *
 }) */


/* app.use(cors({
 * origin: ["http://localhost:3000"],
 * methods: ["GET", "POST"],
 * credentials; true // allows cookie to be enabled.
 })) */

// app.get('/', function(req, res) {
//   res.redirect('/fuel');
// })
//
