const mongoose = require("mongoose");

const roomModal = new mongoose.Schema({
    _id : {
        type : String
    },
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
        _id : String,
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
        _id : String,
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