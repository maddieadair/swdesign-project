const express = require('express');
const session = require('express-session')

const port = 3001
const app = express();
const cookieParser = require('cookie-parser');
app.set('trust proxy', 1)

app.use(express.json());
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'C9IPUj0IEPlMV1Id',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 30000},
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
      "id": "0",
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

app.get('/api/test', function(req, res) {
  // res.json({'Test':'Test'});
  res.redirect("/api/test2");
})

app.post('/api/user', (req, res) => {
	const { username, password } = req.body;
  console.log("We've received a username and password!");
  if (username && password) {
    console.log(req.session);
    console.log(req.session.id);
      // NOTE This is a sample implementation. No hashing is implemented.
    const valid = MyUsers.find(user => user.username === username && user.password === password);
    if (valid) {
      req.session.authenticated = true;
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.user = {
          id: 0
        }
      console.log(req.session);
      res.json(req.session)
      })
    }
    else {
      res.status(401).json({ error: 'Invalid credentials' })
      console.log("Invalid login:" + username + " " + password);
    }
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
    console.log("Invalid login.");
  }
})

app.post('/api/signup', (req, res) => {
	const { username, password } = req.body
  console.log("We got a request!");

  const user = MyUsers.find(user => user.username === username);
  if (user) {
    res.status(400).json({ error: 'User already exists.' });
    console.log("Invalid login." + username);
  }
  else if (!/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(username)) {
    res.status(400).json({ error: 'Invalid credentials' });
    console.log("Invalid credentials." + username);
  }
  const newUser = {
      id: MyUsers.length,
      username: username,
      password: password
  };

  MyUsers.push(newUser);
  req.session.loggedIn = true;
  req.session.user = newUser;
  // req.session.save((err) => {
  //   if (err) {
  //     console.log("Error saving session: " + err);
  //     return res.status(501).json({ error: 'Internal server error.' });
  //   }
    console.log("Our newly made user is: ")
    console.log(req.session)
    res.json(req.session);
  // }
  // )
})

app.post('/api/profile', (req, res) => {
  const {name, address} = req.body;
  console.log("TEST");
  console.log(name + " " + address);
  console.log(req.session);
  console.log("THAT WAS OUR req.session");
  console.log("The user" + req.session.user.username + " is at loc");
  const uid = MyUsers.findIndex(user => user.username === req.session.user.username);
  if (uid === -1) {
    return res.status(404).json({ error: 'Something went wrong.' })
  }
  MyUsers[uid].name = name;
  MyUsers[userIndex].address = address.
  res.json({message: 'Profile updated'});
})

app.get('/api/test3', (req, res) => {
  res.json(MyUsers);
})

app.get('/api/check-auth', (req, res) => {
  console.log("Let's check if this user is authenticated: ");
  console.log(req.session);
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  }
  else {
    res.json({ loggedIn: false });
  }
})

app.get('/api/fuel', (req, res) => {
  const { id } = req.query
  const fuelQuoteHistory = MyFuelQuoteHistory.find(hist => id === hist.id)
  if (!fuelQuoteHistory) {
    console.log("ID " + id + " not found");
  }
  // console.log("ID" + id + " stuff : " + JSON.stringify(fuelQuoteHistory));
  res.json(fuelQuoteHistory);
})

app.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session: ', err);
      res.sendStatus(500);
    }
  })
  res.send("Successfully logged out.")
})

app.listen(port, () => {
      console.log('server listening on port ' + port)
})


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
