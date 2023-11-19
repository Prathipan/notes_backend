const express = require("express");
const { connectDb } = require("./db");
const cors = require("cors");
const { userRouter } = require("./routes/User");
const loginRoute = require("./routes/loginRoute");
const notesRouter = require("./routes/Notes");

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors({oriin : "*"}))
connectDb()

app.get("/",(req,res)=>{
    res.send("Sending message from server")
    console.log("App is working fine");
})


// app.use("/sign-in",userRouter);
app.use("/auth",loginRoute);
app.use("/notes",notesRouter);

app.listen(port,()=>{
    console.log(`App is running on port ${port}`)
})