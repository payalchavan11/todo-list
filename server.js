// Importing express module
import express from "express";

//Import sequelize instance to connect the any database
import { Sequelize, DataTypes } from "sequelize";

/* 
1. Declare a variable named app 
2. and assign a express function to create express application 
*/
const app = express();

// parses json
app.use(express.json());

// Declare a variable named port and assign a value 3000
const port = 3000;

/* 
1. Declare a variable named sequelize 
2. and assign a Sequelize object by passing required information to its constructor 
3. to connect the database 
*/
const sequelize = new Sequelize("rapdb", "appdev", "dev123", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// To check the connection
//exception handling using try and catch block
try {
  // You can use the .authenticate() function to test if the connection is OK
  await sequelize.authenticate();

  console.log("connection has been established successfully");
} catch (error) {
  console.log("unable to connect to the database:", error);
}

// create a module named user in db(sequelize)
//and define a sequelize
const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    //other model operation go here
  }
);

//Synchronizing all models at once...(if you create another model in server
// using sync its automatically create in db)
await sequelize.sync();

/*This creates the table if it doesn't exist
    (and does nothing if it already exists)
    Synchronizing  user model
    */
await User.sync({ alter: true });

// Implement default get route handler to provide a application is running as a response
app.get("/", (req, res) => {
  res.send("Application is running");
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to app");
});

// Implements post request to create a new user in database
//async the req and res
app.post("/users", async (req, res) => {
  // 1.Create a variable  names result
  // 2. and  using create keyword you can create new attributes in user
  //3.  calls save on it.
  const result = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    email: req.body.email,
  });
  res.send(result);
});

// Get all users
app.get("/users", async (req, res) => {
  const result = await User.findAll({});
  res.send(result);
});

// get user by firstName
app.get("/users/:firstName", async (req, res) => {
  // SELECT * FROM rapdb.users;
  const result = await User.findAll({
    where: {
      firstName: req.params.firstName,
    },
  });
  res.send(result);
});

// Implements a put method you update the existing user in database

app.put("/users/:id", async (req, res) => {
  await User.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.send("updated successfully ");
});

// Implements the delete method you can delete the existing record in database
// by passing its id

app.delete("/users/:id", async (req, res) => {
  await User.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.send("deleted successfully");
});

// App starts the server and listen for the connections on the port 3000
app.listen(port, () => {
  // Log the host and a port which server is running
  console.log(`Server is running on http://localhost:${port}`);
});
