const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://thakurrachitsingh:7mSb7dcGDjUUKhC@chatappcluster.82zox.mongodb.net/')
.then(() => { console.log("connection successfull with mongodb")})
.catch((e)=>{console.log(e);})