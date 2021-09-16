///////////// frontend part

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

console.log("falak");
class ChatEngine{
    constructor(chatBoxId, selfId){
        let friends = chatBoxId.split("-");
        friends.sort();
        console.log(friends);
        this.roomName = "chatRoom-"+friends.join("-");
        this.selfId = selfId;
        this.socket = io.connect('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] }); // connet to server .on("connection")
        if(selfId){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        self.socket.on('connect', function(){
            console.log("socket is connected");

            self.socket.emit("joinRoom",{
                chatroom : self.roomName,
                userId : self.selfId,
            });

        });

        self.socket.on("userJoined",function(data){
            if(data.userId!=self.selfId){
                // console.log("a user joined", data);
                $('#online_offline').removeClass("offline_icon");
                $('#online_offline').addClass("online_icon");
            }
            
        });

        $('.chatRoomForm').submit(function(event){
            event.preventDefault();
            let temp = this.childNodes[1];
            let msg = $(temp).val();
            console.log(msg);
            console.log($(this));
            $(temp).val("");
            if(msg!=""){
                self.socket.emit('send_message', {
                    message: msg,
                    chatroom : self.roomName,
                    userId : self.selfId,
                });
            }
        });

        self.socket.on("sendingMsdToRoom",function(data){
            console.log("msg received", data.message);
            let newMessage;
            let selfMsg = false; 
            if(data.userId == self.selfId){
                selfMsg = true;
            }
            if(data.userId!=self.selfId){
                $(`#Typing-${data.userId}`).addClass("d-none");
            }
            console.log("******sending to Ajax");
            console.log("******", selfMsg);
            let selfAvatar;
            let friendAvatar;
            {
                
                $.ajax({
                    type: 'post',
                    url: "/friends/chatcreate",
                    data: {
                        "message": `${data.message}`,
                        "chatroom": `${data.chatroom}`,
                        "selfMsg": `${selfMsg}`,
                    }, // convert form data into JSON
                    
                    // after success data is returned from controller
                    success: function(Data){
                        if(data.userId == self.selfId){
                            // console.log("****** ", selfAvatar);
                            newMessage = selfmsg(data.message,Data.data.selfAvatar);
                        }else{
                            // console.log("****** ", friendAvatar);
                            newMessage = friMsg(data.message,Data.data.friendAvatar);
                        }
                        $(`#wholeChatRoom`).append(newMessage);
                    },
                    error: function(error){
                        console.log(error.responseText);
                    }
                });
            }

            
            
        });

        $(".chatMsgInput").on("keypress",function (event) {
            self.socket.emit('isTyping', {
                chatroom : self.roomName,
                userId : self.selfId,
            });
        });

        self.socket.on("sendingTypingMsdToRoom",function(data){
            console.log('sendingTypingMsdToRoom');
            if(data.userId!=self.selfId){
                $(`#Typing-${data.userId}`).removeClass("d-none");
            }
        });

    }


    

}


let selfmsg = function(message,avatar) {
    return $(`
    <div class="d-flex justify-content-end mb-4">
        <div class="msg_cotainer_send">
            ${message}
        </div>
        <div class="img_cont_msg">
        <img src="${avatar}" class="rounded-circle user_img_msg">
        </div>
    </div>`
    );
}

{/* <span class="msg_time">8:40 AM, Today</span> */}

let friMsg = function(message,avatar) {
    return $(`
    <div class="d-flex justify-content-start mb-4">
        <div class="img_cont_msg">
            <img src="${avatar}" class="rounded-circle user_img_msg">
        </div>
        <div class="msg_cotainer">
            ${message}
            
        </div>
    </div>`
    );
}