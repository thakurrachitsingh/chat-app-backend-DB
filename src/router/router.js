const express = require("express");
const router = express.Router();
const  {register, createRoom, addChatToRoom, getDetails, getUsersList, getRoom, updateReadUnreadMessages}  = require("../controllers/controller");

router.route("/:userName/getUserDetails").get(getDetails);
router.route("/getUsersList").get(getUsersList);
router.route("/:roomId/getRoom").get(getRoom);

router.route("/:userName/:roomId/updateReadUnreadMessages").post(updateReadUnreadMessages);
router.route("/register").post(register);
router.route("/createRoom").post(createRoom);
router.route("/addChat").post(addChatToRoom);

module.exports = router;