function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

module.exports.chatSocket = function(chatServer){
    let io = require('socket.io')(chatServer);
    io.sockets.on('connection', function(socket){
        console.log("new connection established ",socket.id);
        socket.on("joinRoom",function(data){
            socket.join(data.chatroom);
            io.in(data.chatroom).emit("userJoined", data);
        });
        socket.on("send_message",function(data){
            io.in(data.chatroom).emit("sendingMsdToRoom", data); 
        });
        socket.on('isTyping',function(data){
            io.in(data.chatroom).emit("sendingTypingMsdToRoom", data);
        });
        socket.on("disconnect", function(){
            console.log("socket disconnected");
        });
    });
}


