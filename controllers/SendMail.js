const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.mail,
    pass: process.env.pass,
  },
});

const sendMail = (toEmail,subject,content) => {
  const mailOptions = {
    from : process.env.mail,
    to : toEmail,
    subject : subject,
    html : content
  }

  transporter.sendMail(mailOptions,(error,info)=>{
    if(error)
     {
        console.log("error occured",error);
     }else{
        console.log("Email sent :",info.response);
     }
  })
}

module.exports = {sendMail}