const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const CheckUser = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return "Server busy";
  }
};

const AuthenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = await jwt.sign( {userId : user._id,email : user.email} , process.env.login_secret,{expiresIn : "1d"});
      const response = {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        token: token,
        status: true,
      };
      await User.findOneAndUpdate(
        { email: user.email },
        { $set: { token: token } },
        { new: true }
      );
      return response;
    }
    return "Invalid User name or password";
  } catch (error) {
    console.log(error);
    return "Server busy";
  }
};

const AuthorizeUser = async (req,res,next) => {
  try {
    const token = req.headers.authorization;
    jwt.verify(token,process.env.login_secret,(err,decode) => {
      if(err) return res.send("Token is not valid please login");
      if(decode)
       {
        req.body.user = decode.userId;
        next();
       }else{
        res.send("Token is not valid please login")
       }
    })
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = { CheckUser, AuthenticateUser,AuthorizeUser };
