const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
// const bodyParser = require("body-parser")
require("dotenv").config();

const port = 3001;
const app = express();
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(
  session({
    secret: "C9IPUj0IEPlMV1Id",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000, httpOnly: false, secure: false },
  })
);

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

app.post("/api/signup", async (req, res) => {
  if (req.body.constructor !== Object || Object.keys(req.body).length < 2) {
    return res.sendStatus(401);
  }
  const data = req.body;
  console.log("body", data);
  const Username = data.username;
  const Password = data.password;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const query = `INSERT INTO user_credentials(Username, Password) VALUES(?, ?)`;
    console.log(hashedPassword);
    connection.query(query, [Username, hashedPassword], (error, result) => {
      if (error) {
        console.log(error);
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
  console.log("data,", data);
  const Username = data.username;
  const Password = data.password;

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
            console.log(req.sessionID);
            // res.send(req.session.sessionID)
            return res.json(req.session);
            // return res.status(200).send(req.session);
          });
          // return res.status(200).json({ messsage: "Login was successful!" });
        } else {
          return res.status(401).json({ error: "Invalid credentials!" });
        }
      });
    } else {
      return res
        .status(401)
        .json({ error: "An account with this username does not exist!" });
    }
  });
});

app.post("/api/profile", (req, res) => {
  console.log("test");
  console.log(req.session.loggedIn);
  if (!req.session || !req.session.loggedIn) {
    console.log("not logged in");
    return res.status(401).json({ message: "Not logged in" });
  } else {
    console.log(req.session);
    console.log("logged in");

    if (req.body.constructor !== Object || Object.keys(req.body).length < 6) {
      return res.sendStatus(400);
    }

    const data = req.body;

    if (data.address2 === "") {
      data.address2 = null;
    }

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

app.put("/api/profile", (req, res) => {
  console.log("test");
  console.log(req.session.loggedIn);
  if (!req.session || !req.session.loggedIn) {
    console.log("not logged in");
    return res.status(401).json({ message: "Not logged in" });
  } else {
    console.log(req.session);
    console.log("logged in");

    if (req.body.constructor !== Object || Object.keys(req.body).length < 6) {
      return res.sendStatus(400);
    }

    const data = req.body;
    console.log(req.body)
    console.log("data:", data)

    const name = data.name;
    const address1 = data.address1;
    let address2 = data.address2;
    const city = data.city;
    const state = data.state;
    const zipcode = data.zipcode;

    if (address2 === "") {
      address2 = null;
    }

    const query = `UPDATE client_information SET Name=?, Address1=?, Address2=?, City=?, State=?, Zipcode=? WHERE Client_ID=?`;

    connection.query(
      query,
      [name, address1, address2, city, state, zipcode, req.session.user.id],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.status(401).json({ erorr: error });
        } else {
          return res
            .status(200)
            .json({ message: "Profile information successfully updated!" });
        }
      }
    );
  }
});

app.get("/api/profile", (req, res) => {
  console.log("test");
  //   console.log("session:". req.session)
  //   console.log(req.session.loggedIn);
  if (!req.session || !req.session.loggedIn) {
    console.log("not logged in");
    return res.status(401).json({ message: "Not logged in" });
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
    return res.status(401).json({ message: "Not logged in" });
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
        return res.status(500).json({ error: error });
      } else {
        return res
          .status(200)
          .json({ message: "Fuel Quote info successfully added!" });
      }
    });
  }
});

app.get("/api/check-history", (req, res) => {
    console.log("test");
    console.log(req.session.loggedIn);
    if (!req.session || !req.session.loggedIn) {
      console.log("not logged in");
      return res.status(401).json({ message: "Not logged in" });
    } else {
      console.log(req.session);
      console.log("logged in");
    
      const query = `SELECT 1 AS hasHistory FROM fuel_quote WHERE Client_ID = (?) LIMIT 1;`;
  
      connection.query(query, req.session.user.id, (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ erorr: error });
        } else {
            console.log(result)
          return res
            .status(200)
            .json(result);
        }
      });
    }
  });

app.get("/api/fuel-quote", (req, res) => {
  console.log("test");
  // console.log(req.session.user.id);
  if (!req.session || !req.session.loggedIn) {
    console.log("not logged in");
    return res.status(401).json({ message: "Not logged in" });
  }
  else {
    console.log(req.session);
    console.log(req.session.user.id)
    console.log("logged in");

    const query = `SELECT *, DATE_FORMAT(Delivery_Date, "%M %e, %Y") AS New_Date, FORMAT(Suggested_Price, 2) AS Suggested, FORMAT(Total_Amount_Due, 2) AS Total FROM fuel_quote WHERE Client_ID=?`;

    connection.query(query, req.session.user.id, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: error });
      } else {
        return res.status(200).json(result);
      }
    });
  }
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

app.post("/api/logout", (req, res) => {
  console.log("Request to logout from: " + req.session);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session: ", err);
      res.sendStatus(500);
    } else {
      res.clearCookie("connect.sid", { path: "/", domain: "localhost" });
      res.send("Successfully logged out.");
      console.log("cookie cleared");
    }
  });
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
