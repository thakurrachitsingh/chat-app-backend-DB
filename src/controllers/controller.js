const user = require("../mongooseModals/User");
const room = require("../mongooseModals/Room");




const getDetails = async (req, res)=>{
    const userName = req.params.userName;
    try{
        const queryObj = {};
        queryObj.userName = userName;
        const userDetails = await user.findOne(queryObj);
        const responseToSend = successResponse("Success");
        responseToSend.userDetails = userDetails;
        res.status(200).send(responseToSend);
    }catch(e){
        errorResponse(e);
    }
}

const getUsersList = async (req, res)=>{
    try{
        const usersList = await user.find({});
        const responseToSend = successResponse("Success");
        responseToSend.usersList = usersList;
        res.status(200).send(responseToSend);
    }catch(e){
        errorResponse(e);
    }
}

const getRoom = async(req, res) =>{
    const roomId = req.params.roomId;
    try{
        const roomDataToSend = await room.findOne({"roomId":roomId});
        const responseObj = successResponse("Success");
        responseObj.room = roomDataToSend;
        res.status(200).send(responseObj);
    }catch(e){
        errorResponse(e);
    }
}


const register = async(req, res) =>{
    const {name, email, userName, roomIds} = req.body;
    const queryObj = {};
    const response = {};
    try{
        if(email) queryObj.email = email;
        const userExistance = await user.find(queryObj);
        const userNameExistance = await user.find({"userName" : userName});
        if(userExistance!=0){
            response.message = "Email already exists"
        }else if(userNameExistance!=0){
            response.message = "UserName already exists"
        }else{
            const userData = new user({"name": name, "email": email, "userName": userName})
            const createdUser = await userData.save();
            response.message = "User created"
            response.user = createdUser
        }
        response.code = 0;
        res.status(200).send(response);
    }catch(e){
        response.code = 404;
        response.message = e;
        res.status(404).send(response);
    }
}

const createRoom = async (req, res)=>{
    const queryObj = {};
    const response = {};
    try{
        const { _id, roomId, admin, members } = req.body;
    if(roomId!=null && admin!=null && members!=null){
        const newRoom = new room({"_id":_id, "roomId":roomId, "admin":admin, "members":members});
        const createdRoom = await newRoom.save();
        response.room = createdRoom;
        const roomIdObject = {};
        roomIdObject.roomId = roomId
        // await user.updateOne({"userName": admin}, {$push : {"roomIds": roomIdObject}});
        members.map(async function(userName){
            await user.updateOne({"userName": userName.userName}, {$push : {"roomIds": roomIdObject}});
        })
    }
    response.code = 0;
    response.message = "room created"
    res.status(200).send(response);
    }catch(e){
        response.code = -1;
        response.message = `Error: ${e}`
        res.status(404).send(response);
    }
}

const addChatToRoom = async (req, res)=>{
    const queryObj = {};
    const {roomId, chat} = req.body;
    try{
        if(roomId && chat){
            queryObj.roomId = roomId;
            const roomExistance = await room.findOne(queryObj);
            if(roomExistance!=0){
                await room.updateOne({"roomId": roomId}, {$push : {"chats": chat}});
                res.status(200).send(successResponse("Updated SuccessFully"));
            }else{
                res.status(200).res.send({"code": 0, "message": "Room doesn't exisit"});
            }
        }
    }catch(e){
        res.status(404).send(errorResponse(e));
    }
}

const updateReadUnreadMessages = async (req, res) =>{
    const { userName, roomId } = req.params;
    const { unread , unrecieved} = req.query;
    try{
        const roomData = await room.findOne({"roomId":roomId});
        var documentId = "";
        var preUnread = 0;
        var preUnrecieved = 0;
        roomData.members.map(it => 
            {
                if (it.userName==userName) {
                    preUnread = it.unread+1;
                    preUnrecieved = it.unrecieved+1;     
                    documentId = it._id.toString();     
                }
            }
        )
        const queryObj = {};
        if(unread!=null && unrecieved!=null){
            updateUnreadData(unread, roomId, documentId, preUnread);
            updateUnrecieved(unrecieved, roomId, documentId, preUnrecieved);
        }else if(unread!=null){
              if(unread==-1){
                await room.updateOne(
                    {
                        "roomId" : roomId, 
                        "members._id" : documentId
                    },
                    {
                        $set : {"members.$.unread" : 0}
                    }
                );
              }else{
                updateUnreadData(unread, roomId, documentId, preUnread);
              }
        }else if(unrecieved!=null){
            if(unrecieved==-1){
                await room.updateOne(
                    {
                        "roomId" : roomId, 
                        "members._id" : documentId
                    },
                    {
                        $set : {"members.$.unrecieved" : 0}
                    }
                );
            }else{
                updateUnrecieved(unrecieved, roomId, documentId, preUnrecieved)
            }
        }
        res.send({"message": "Done"});
    }catch(e){
        errorResponse(e);
    }
}

async function updateUnreadData(unread, roomId, documentId, preUnread){
    const queryObj = {};
    queryObj.unread = unread;
    const x = await room.updateOne({
        "roomId" : roomId,
        "members._id": documentId
              }, {
        $set : {
            "members.$.unread" : preUnread
        }
        });
}

async function updateUnrecieved(unrecieved, roomId, documentId, preUnrecieved){
    const queryObj = {};
    queryObj.unrecieved = unrecieved;
    await room.updateOne({
        "roomId" : roomId,
        "members._id": documentId
        }, {
            $set : {
            "members.$.unrecieved" : preUnrecieved
            }
        });
}

function successResponse(message){
    const successRes = {};
    successRes.code = 0;
    successRes.message = message;
    return successRes;
}

function errorResponse(e){
    const response = {};
    response.code = -1;
    response.message = `Error: ${e}`
    return response;
}


module.exports = {register, createRoom, addChatToRoom, getDetails, getUsersList, getRoom, updateReadUnreadMessages}