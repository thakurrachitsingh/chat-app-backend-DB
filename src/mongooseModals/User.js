const mongoose = require("mongoose");
const { type } = require("os");

const modal = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    userName : {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    roomIds:[{
        roomId: {
            type : String
        }
    }]
},
{ 
    versionKey: false 
})

const user = new mongoose.model("user", modal);

module.exports = user;