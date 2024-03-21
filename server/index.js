const express = require('express');

const port = 3001
const app = express();
app.use(express.json());

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

app.post('/api/user', (req, res) => {
	const { username, password } = req.body
  const user = MyUsers.find(user => user.username === username && user.password === password);

  if (user) {
    res.json({ token: user.token });
    console.log("User logged in.");
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
    console.log("Invalid login.");
  }
})

app.post('/api/signup', (req, res) => {
	const { username, password } = req.body
  const user = MyUsers.find(user => user.username === username);
  if (user) {
    res.status(400).json({ error: 'User already exists.' });
    console.log("Invalid login." + username);
  } else if (!/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(username)) {
    res.status(400).json({ error: 'Invalid credentials' });
    console.log("Invalid credentials." + username);
  }
  else {
    MyUsers.push({"id": MyUsers.length + 1, "username": username, "password": password})
    console.log("User signed up successfully: " + username)
    res.status(201).json({ message: 'User signed up successfully.', user: username });
  }
})

app.post('/api/profile', (req, res) => {
  return;
})

app.get('/api/fuel', (req, res) => {
  const { id } = req.query
  const fuelQuoteHistory = MyFuelQuoteHistory.find(hist => id === hist.id)
  console.log("ID" + id + " stuff : " + JSON.stringify(fuelQuoteHistory));
  res.json(fuelQuoteHistory);
})

app.listen(port, () => {
      console.log('server listening on port ' + port)
})
