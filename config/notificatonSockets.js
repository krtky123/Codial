//////////  server part (include in sever.js)

const { user } = require('./mongoose');
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

 

module.exports.notificatonSocket = function(notificatonServer){
    let io = require('socket.io')(notificatonServer);

    io.sockets.on('connection', function(socket){
        // socket is send by user
        console.log("new notification connection established ",socket.id);
        // send ack automatically to user that connection established .socket.on('connect')

        socket.on("joinRoom",function(data){
            // console.log("joining req accepted", data);
            // console.log("***___ ",data.chatroom);
            // create a chatroom of this name or join in this chatroom name
            socket.join(data.chatroom);
        });

        socket.on("LikeNotification",function(data){
            // console.log(data);
            console.log("Notificaion-"+data.data.person);
            io.in("Notificaion-"+data.data.person).emit("sendingMsdToPerson", data.data);
            
        });
        
        socket.on("CommentNotification",function(data){
            // console.log(data,"  **********************++++++++++ ");
            console.log("Notificaion-"+data.data.person);
            io.in("Notificaion-"+data.data.person).emit("sendingCommentNotiToPerson", data.data);
            
        });

        socket.on("addRemoveFriend",function(data){
            io.in("Notificaion-"+data.data.id).emit("addingRemFriendToPerson", data);
        });

        socket.on("disconnect", function(){
            console.log("socket disconnected");
        });

    });

}


