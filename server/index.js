const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
require("dotenv").config();

const port = 3001;
const app = express();
const cookieParser = require("cookie-parser");
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(
  session({
    secret: "C9IPUj0IEPlMV1Id",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30000 * 60 },
    secure: false,
  })
);
MyUsers = [
  {
    id: 0,
    name: "John Doe",
    username: "johndoe",
    password: "jane",
    address: {
      state: "Texas",
      city: "Houston",
      zipcode: "40170",
      address1: "123 Sample Street",
      address2: "Town, USA 12345",
    },
  },
  {
    id: 1,
    name: "Jane Doe",
    username: "janedoe",
    password: "john",
    address: {
      state: "Texas",
      city: "Houston",
      zipcode: "40170",
      address1: "123 Sample Street",
      address2: "Town, USA 12345",
    },
  },
];
MyFuelQuoteHistory = [
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
app.post("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.post("/api/user", (req, res) => {
  const { username, password } = req.body;
  console.log("We've received a username and password!");
  if (username && password) {
    // console.log(req.session);
    // console.log(req.session.id);
    // NOTE This is a sample implementation. No hashing is implemented.
    const myID = MyUsers.findIndex(
      (user) => user.username === username && user.password === password
    );
    if (myID != -1) {
      req.session.save(() => {
        req.session.authenticated = true;
        req.session.loggedIn = true;
        req.session.user = {
          id: MyUsers[myID].id,
          username: MyUsers[myID].username,
        };
        console.log(req.session);
        res.json(req.session);
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
      console.log("Invalid login:" + username + " " + password);
    }
  } else {
    res.status(401).json({ error: "Invalid credentials" });
    console.log("Invalid login.");
  }
});

// app.post('/api/signup', (req, res) => {
//   const { username, password } = req.body
//   console.log("We got a request!");

//   const user = MyUsers.find(user => user.username === username);
//   if (user) {
//     console.log("Invalid login." + username);
//     return res.status(400).json({ error: 'User already exists.' });
//   }
//   else if (!/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(username)) {
//     console.log("Invalid credentials." + username);
//     return res.status(400).json({ error: 'Invalid credentials' });
//   }
//   const id = MyUsers.length;
//   var newUser = {
//       id: id,
//       username: username,
//       password: password,
//   };
//   MyUsers.push(newUser);
//   req.session.save(() => {
//     req.session.authenticated = true;
//     req.session.loggedIn = true;
//     req.session.user = newUser;
//     console.log("Our newly made user is: ")
//     console.log(req.session);
//     console.log("-----------------------------------")
//     res.json(req.session.user)
//   })
//   // req.session("HELP");
//   // console.log("Our newly made user is: ")
//   // console.log(req.session)
//   // res.json(req.session);
// })

app.post("/api/signup", async (req, res) => {
  if (req.body.constructor !== Object || Object.keys(req.body).length < 2) {
    return res.sendStatus(500);
  }
  const data = req.body;
  const Username = data.Username;
  const Password = data.Password;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const query = `INSERT INTO user_credentials(Username, Password) VALUES(?, ?)`;
    console.log(hashedPassword);
    connection.query(query, [Username, hashedPassword], (error, result) => {
      if (error) {
        if (error.code == "ER_DUP_ENTRY" || error.errno == 1062) {
          return res
            .status(401)
            .json({ error: "A user with this username already exists" });
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

app.post("/api/login", async (req, res) => {
  if (req.body.constructor !== Object || Object.keys(req.body).length < 2) {
    return res.sendStatus(500);
  }
  const data = req.body;
  const Username = data.Username;
  const Password = data.Password;

  const query = `SELECT * FROM user_credentials WHERE Username=?`;

  connection.query(query, [Username], (error, result) => {
    if (error) {
      return res.status(500).json({ erorr: error });
    } else if (result.length > 0) {
      bcrypt.compare(Password, result[0].Password, function (error, results) {
        if (results) {
          req.session.save(() => {
            req.session.authenticated = true;
            req.session.loggedIn = true;
            req.session.user = {
              id: result[0].ID,
              password: result[0].Password,
            };
            console.log(req.session);
            return res.json(req.session);
          });
          // return res.status(200).json({ messsage: "Login was successful!" });
        } else {
          return res.status(401).json({ message: "Invalid credentials!" });
        }
      });
    } else {
      return res
        .status(401)
        .json({ message: "An account with this username does not exist!" });
    }
  });
});

app.post("/api/profile", (req, res) => {
  console.log("test");
  console.log(req.session.loggedIn);
  if (!req.session || !req.session.loggedIn) {
    console.log("not logged in");
    return res.status(500).json({ message: "Not logged in" });
  } else {
    console.log(req.session);
    console.log("logged in");

    if (req.body.constructor !== Object || Object.keys(req.body).length < 6) {
        return res.sendStatus(500);
      }

    const data = req.body;
    const userInfo = [
      req.session.user.id,
      data.name,
      data.address1,
      data.address2,
      data.city,
      data.state,
      data.zipcode,
    ];

    const query = `INSERT INTO client_information(Client_ID, Name, Address1, Address2, City, State, Zipcode) VALUES (?)`;

    connection.query(query, [userInfo], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ erorr: error });
      } else {
        return res
          .status(200)
          .json({ message: "Profile information successfully added" });
      }
    });
  }
});

app.get("/api/profile", (req, res) => {
  console.log("test");
  console.log(req.session.loggedIn);
  if (!req.session || !req.session.loggedIn) {
    console.log("not logged in");
    return res.status(500).json({ message: "Not logged in" });
  } else {
    console.log(req.session);
    console.log("logged in");

    const query = `SELECT * from client_information WHERE Client_ID=?`;

    connection.query(query, req.session.user.id, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ erorr: error });
      } else {
        return res.status(200).json(result);
      }
    });
  }
});

app.post("/api/fuel-quote", (req, res) => {
  console.log("test");
  console.log(req.session.loggedIn);
  if (!req.session || !req.session.loggedIn) {
    console.log("not logged in");
    return res.status(500).json({ message: "Not logged in" });
  } else {
    console.log(req.session);
    console.log("logged in");


    const data = req.body;
    const fuelInfo = [
      req.session.user.id,
      data.gallons,
      data.deliveryAddress,
      data.deliveryDate,
      data.suggestedPrice,
      data.totalBill,
    ];

    const query = `INSERT INTO fuel_quote(Client_ID, Gallons_Requested, Delivery_Address, Delivery_Date, Suggested_Price, Total_Amount_Due) VALUES(?)`;

    connection.query(query, [fuelInfo], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ erorr: error });
      } else {
        return res.status(200).json({ message: "Fuel Quote info successfully added!"});
      }
    });
  }
});

app.get("/api/fuel-quote", (req, res) => {
    console.log("test");
    console.log(req.session.loggedIn);
    if (!req.session || !req.session.loggedIn) {
      console.log("not logged in");
      return res.status(500).json({ message: "Not logged in" });
    } else {
      console.log(req.session);
      console.log("logged in");
    
      const query = `SELECT * from fuel_quote WHERE Client_ID=?`;
  
      connection.query(query, req.session.user.id, (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ erorr: error });
        } else {
          return res.status(200).json(result);
        }
      });
    }
  });

app.get("/api/db", (req, res) => {
  res.json(MyUsers);
});

app.get("/api/check-auth", (req, res) => {
  console.log("Analyzing if this user is authenticated:");
  console.log(req.session);
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get("/api/fuel", (req, res) => {
  console.log(req.session.user);
  const id = req.session.user.id;
  var fuelQuoteHistory = MyFuelQuoteHistory.find((hist) => id === hist.id);
  if (!fuelQuoteHistory) {
    console.log("ID " + id + " not found; Creating a new entry.");
    fuelQuoteHistory = {
      id: id,
      History: [],
    };
    MyFuelQuoteHistory.push(fuelQuoteHistory);
  }
  res.json(fuelQuoteHistory);
});

app.post("/api/logout", (req, res) => {
  console.log("Request to logout from: " + req.session);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session: ", err);
      res.sendStatus(500);
    }
  });
  res.send("Successfully logged out.");
});

if (require.main === module) {
  app.listen(port, () => {
    console.log("server listening on port " + port);
  });
}

module.exports = app;

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
