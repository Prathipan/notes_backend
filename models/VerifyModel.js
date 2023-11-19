const mongoose = require("mongoose");


const VerifySchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    },
    {
        collection : "VerifyUser"
    }
)

module.exports = mongoose.model("VerifyUser",VerifySchema)