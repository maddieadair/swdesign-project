const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const mysql = require("mysql");
require("dotenv").config();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const users = [
  {
    id: 0,
    name: "John Doe",
    username: "johndoe",
    password: "jane",
    state: "Texas",
    city: "Houston",
    zipcode: "40170",
    address1: "123 Sample Street",
    address2: "Town, USA 12345",
  },
  {
    id: 1,
    name: "Jane Doe",
    username: "janedoe",
    password: "john",
    state: "Texas",
    city: "Houston",
    zipcode: "40170",
    address1: "123 Sample Street",
    address2: "Town, USA 12345",
  },
];

const history = [
  {
    id: 0,
    History: [
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
      },
    ],
  },
];

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  multipleStatements: true,
});

connection.getConnection(function (err) {
  if (err) throw err;
  console.log("You are now connected...");
});

// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

/////////////////////////////////////////////////////////////////////

// Define a GET route
app.get("/api/users", (req, res) => {
  // Fetch users from the database
  connection.query("SELECT * FROM user-credentials", (error, results) => {
    if (error) {
      console.error("Error fetching users from the database: " + error.stack);
      return res.status(500).json({ error: "Failed to fetch users" });
    } else {
      return res.status(200).json(result);
    }
  });
});

app.post("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.post("/register", async (req, res) => {
  if(req.body.constructor !== Object || Object.keys(req.body).length < 2){
      return res.sendStatus(500);
  }
  const data = req.body;
  const username = data.username;
  const password = data.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO user_credentials(Username, Password) VALUES(?, ?)`;
    console.log(hashedPassword)
    connection.query(query, [username, hashedPassword], (error, result) => {
      if (error) {
        if (error.code == 'ER_DUP_ENTRY' || error.errno == 1062){
            return res.status(500).json({error: "A user with this username already exists"})
        } else {
            return res.status(500).json({ erorr: error });
        }
      } else {
        return res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("We've received a username and password!");
  console.log(req.body);
  if (username && password) {
    // console.log(req.session);
    // console.log(req.session.id);
    // NOTE This is a sample implementation. No hashing is implemented.
    const myID = users.findIndex(
      (user) => user.username === username && user.password === password
    );
    console.log(myID);
    if (myID != -1) {
      console.log("test");
    } else {
      res.status(200).json({ error: "Invalid credentials" });
      console.log("Invalid login:" + username + " " + password);
    }
  } else {
    res.status(200).json({ error: "Invalid credentials" });
    console.log("Invalid login.");
  }
});

// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   console.log("Username:", username);
//   console.log("Password:", password);

//   const findUser = users.find(
//     (user) => user.username === username && user.password === password
//   );
//   if (findUser) {
//     console.log("User already exists");
//     return res.status(200).json({ error: "User already exists" });
//   } else if (
//     !/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(username) ||
//     password.length < 7
//   ) {
//     console.log("Invalid credentials");
//     return res.status(200).json({ error: "Invalid credentials" });
//   } else {
//     try {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
//       users.push({
//         id: Date.now().toString(),
//         name: req.body.name,
//         username: req.body.username,
//         password: hashedPassword,
//         address1: req.body.address1,
//         address2: req.body.address2,
//         state: req.body.state,
//         city: req.body.city,
//       });
//       console.log("Done");
//       res.status(200).json({ message: "Signup successful!" });
//     } catch {
//       console.log("After catch");
//       res.status(200).json({ error: "Signup unsuccessful" });
//     }
//     console.log(users);
//   }
// });

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
