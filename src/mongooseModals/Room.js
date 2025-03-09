const mongoose = require("mongoose");

const roomModal = new mongoose.Schema({
    roomId : {
        type : String,
        required : true,
        unique : true
    },
    admin : {
        type : String,
        required: true
    },
    members : [{
        userName : {
            type: String
        },
        unread : {
            default: 0,
            type: Number
        },
        unrecieved :{
            default: 0,
            type: Number
        } 
    }],
    chats : [{
        userName : {
            type : String,
        },
        chat : {
            type : String
        },
        time: {
            type: String
        }
    }]
},
{versionKey : false});

const room = new mongoose.model("room", roomModal);

module.exports = room;