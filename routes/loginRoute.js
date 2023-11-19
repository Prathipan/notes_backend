const express = require("express");
const { AuthenticateUser, CheckUser } = require("../controllers/login");
const client = require("../redis");
const { InsertVerifyUser, InsertNewUser } = require("../controllers/signup");

const loginRoute = express.Router();

client
  .connect()
  .then(() => {
    console.log("Connected to redis");
  })
  .catch((e) => {
    console.log(e);
  });

loginRoute.get("/:token", async (req, res) => {
  try {
    const response = await InsertNewUser(req.params.token);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(
      `<html>
          <body>
            <h3>Registration Failed</h3>
            <p>Link expired....</p>
  
            <p>Regards,</p>
            <p>Team</p>
          </body>
        </html>`
    );
  }
});

loginRoute.post("/register", async (req, res) => {
  try {
    const { name, email, password } = await req.body;
    console.log(name, email, password);
    const registerCredentials = await CheckUser(email);
    if (registerCredentials === false) {
      await InsertVerifyUser(name, email, password);
      res.status(200).send("Confirmation mail sent Successfully");
    } else if (registerCredentials === true) {
      res.status(200).send("User already exists");
    } else if (registerCredentials === "Server busy") {
      res.status(500).send("Server busy");
    }
  } catch (error) {
    console.log(error);
  }
});

loginRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let loginCredentials = await AuthenticateUser(email, password);
  if (loginCredentials === "Invalid user name or password") {
    res.status(500).send("Invalid user name or password");
  } else if (loginCredentials === "Server busy") {
    res.status(500).send("Server busy");
  } else {
    res.status(200).json( loginCredentials );
  }
});

module.exports = loginRoute;
