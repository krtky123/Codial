const Post = require('../models/post')
const Comment = require('../models/comment')
const Like = require('../models/like')
const User = require('../models/user')
const ChatRoom = require('../models/chatRoom')
const ChatMessages = require('../models/chatMessages')
const FriendRequest = require("../models/friendNotification");

module.exports.addRemoveFriend = async function(req,res){

    let friendUser = await User.findById(req.query.id);
    let arrayFriends = req.user.friendList;
    console.log(req.query.task);
    if(req.query.task=="Remove")
    {
        console.log(`in ${req.query.task}ing area`);
        req.user.friendList.pull(req.query.id);
        friendUser.friendList.pull(req.user._id);
    }
    else if(req.query.task=="Add"){
        
        console.log(`in ${req.query.task}ing area`);
        await FriendRequest.create({
            from: req.user._id,
            to: req.query.id,
        });
        req.user.pendingList.push(req.query.id);
        friendUser.friendReqList.push(req.user._id);
    }
    else if(req.query.task == "Accept"){
        console.log(`in ${req.query.task}ing area`);
        await FriendRequest.deleteOne({
            from: req.query.id,
            to: req.user._id,
        });
        req.user.friendList.push(req.query.id);
        friendUser.friendList.push(req.user._id);
        req.user.friendReqList.pull(req.query.id);
        friendUser.pendingList.pull(req.user._id);
    }
    else if(req.query.task == "Reject"){
        console.log(`in ${req.query.task}ing area`);
        await FriendRequest.deleteOne({
            from: req.query.id,
            to: req.user._id,
        });
        req.user.friendReqList.pull(req.query.id);
        friendUser.pendingList.pull(req.user._id);
    }
    else if(req.query.task == "Cancel"){
        console.log(`in ${req.query.task}ing area`);
        await FriendRequest.deleteOne({
            from: req.user._id,
            to: req.query.id,
        });
        req.user.pendingList.pull(req.query.id);
        friendUser.friendReqList.pull(req.user._id);
    }
    req.user.save();
    friendUser.save();

    return res.json(200, {
        message: "Request successful!",
        data: {
            id : friendUser._id,
            id1 : req.user._id,
            name : friendUser.name,
            name1: req.user.name,
            // addedFriend: addedFriend,
            task : req.query.task,
        }
    });
    

}

module.exports.chat = async function(req,res){
    
    let friendUser = await User.findById(req.query.id);
    var friendsList = [req.query.id,req.user._id];
    friendsList.sort();
    let chatroomName = "chatRoom-"+friendsList.join("-");
    // console.log("**********ddd ",chatroomName);
    let Chatroom = await await ChatRoom.findOne({name:chatroomName}).populate({path:"messages"});
    if(!Chatroom){
        Chatroom = await ChatRoom.create({
            name:chatroomName,
        });
    }
    // console.log("*********Friend* ", friendUser);
    return res.render('_chatroom',{
        title : "profile",
        chatUser : friendUser,
        ChatroomInfo : Chatroom,
    });

}

module.exports.chatcreate = async function(req,res) {
    console.log("*******chat creation");
    try{
        let message = req.body.message;
        let chatroomName = req.body.chatroom;
        let users = chatroomName.split("-");
        // console.log("*******88 ", req.body);
        // console.log("*******88 ", message);
        let to = users[1];
        if(to==req.user.id){
            to = users[2];
        }
        let friend = await User.findById(to);
        let friendAvatar = friend.avatar;
        let selfAvatar = req.user.avatar;
        console.log("******************* ", selfAvatar);
        console.log("******************* ", friendAvatar);
        if(req.body.selfMsg=="true")
        {
            console.log(req.body.selfMsg);
            let Chatroom = await ChatRoom.findOne({name:chatroomName});
            if(!Chatroom){
                Chatroom = await ChatRoom.create({
                    name:chatroomName,
                });
            }
            let messageCreate = await ChatMessages.create({
                from: req.user ,
                to: to,
                chatRoom: Chatroom,
                content: message,
            });
            // console.log(messageCreate);
            Chatroom.messages.push(messageCreate);
            Chatroom.save();
        }
        return res.status(200).json({
            message: "successful!",
            data: {
                friendAvatar : friendAvatar,
                selfAvatar : selfAvatar,
            }
        });


    }catch(err){
        console.log(err);
    }
}