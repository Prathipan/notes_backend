const mongoose = require("mongoose")


const NotesSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String
    },
    user : {
        type : String,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now // Set the default value to the current date and time
      }
},
{
    collection : "Notes"
},{
    timestamps : true
})

module.exports = mongoose.model("Notes",NotesSchema)