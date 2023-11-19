const express = require("express");
const { CheckUser } = require("../controllers/login");
const { InsertVerifyUser, InsertNewUser } = require("../controllers/signup");

const userRouter = express.Router();

userRouter.get("/:token", async (req, res) => {
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

userRouter.post("/verify", async (req, res) => {
  try {
    const { name, email, password } = await req.body;
    console.log(name, email, password);
    const registerCredentials = await CheckUser(email);
    if (registerCredentials === false) {
      await InsertVerifyUser(name, email, password);
      res.status(200).send("User Created Successfully");
    } else if (registerCredentials === true) {
      res.status(200).send("User already exists");
    } else if (registerCredentials === "Server busy") {
      res.status(500).send("Server busy");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { userRouter };
