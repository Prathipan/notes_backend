const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const VerifyModel = require("../models/VerifyModel");
const UserModel = require("../models/UserModel");
const { sendMail } = require("./SendMail");

dotenv.config();

const InsertVerifyUser = async (name, email, password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = await generateToken(email);

    const newUser = new VerifyModel({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    const activationLink = `https://notes-backend-4irj.onrender.com/auth/${token}`;
    const content = `<h3>Hi, there</h3>
    <h3>Welcome to the app</h3>
    <p>Thank you for signing up.Click on the below link to activate</p>
    <a href="${activationLink}" >Click here</a>

    <p>Regards,</p>
    <p>Team</p>`;

    await newUser.save();
    sendMail(email, "Verify User", content);
  } catch (error) {
    console.log(error);
  }
};

const generateToken = async (email) => {
  const token = await jwt.sign(email,process.env.JWT_SECRET);
  return token;
};

const InsertNewUser = async (token) => {
  try {
    const userVerify = await VerifyModel.findOne({ token: token });
    console.log(userVerify);
    if (userVerify) {
      const newUser = new UserModel({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
      });
      await newUser.save();
      await VerifyModel.findOneAndDelete({ token: token });
      const content = `<h3>Registration Successfull</h3>
                          <h3>Welcome to the app</h3>
                           <p>User Verified Successfully</p>

                           <p>Regards,</p>
                           <p>Team</p>`;

      sendMail(newUser.email, "Registration Successfull", content);
      return `<html>
              <body>
                   <h3>Registration Successfull</h3>
                   <h3>Welcome to the app</h3>
                   <p>User Successfully Registered</p>

                   <p>Regards,</p>
                   <p>Team</p>
                </body>
                </html>`;
    }
    return `<html>
    <body>
    <h3>Registration Failed</h3>
   <h3>Link Expired...</h3>
   <p>User verification Failed</p>

   <p>Regards,</p>
   <p>Team</p>
   </body>
   </html>`;
  } catch (error) {
    console.log(error);
    `<html>
    <body>
    <h3>Registration Failed</h3>
     <p>Unexpected error happened</p>

   <p>Regards,</p>
   <p>Team</p>
   </body>
   </html>`;
  }
};

module.exports = { InsertVerifyUser,InsertNewUser };
