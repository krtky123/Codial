

class NotificationEngine{
    constructor(selfId){
        this.selfId = selfId;
        this.roomName = "Notificaion-"+selfId;
        this.socket = io.connect('http://localhost:8080', { transports: ['websocket', 'polling', 'flashsocket'] }); // connet to server .on("connection")
        
        if(selfId){
            console.log(this.roomname);
            this.connectionHandler();
        }
        
    }

    connectionHandler(){
        let self = this;
        self.socket.on('connect', function(){
            console.log("socket notification is connected");

            self.socket.emit("joinRoom",{
                chatroom : self.roomName,
                userId : self.selfId,
            });

        });

        $("#postlist").on("click", ".Likes", function(event){
            Likes(event,self,this);
        });

        self.socket.on("sendingMsdToPerson",function(data){
            if(self.selfId != data.from)
            {
                let Text = `${data.tag} ${data.content} is liked by <a href="/profile/${data.from}"> ${data.name}</a>`;
                new Noty({
                theme: 'relax',
                text: Text,
                type: 'success',
                layout: 'bottomLeft',
                timeout: 1500
                
                }).show();

                $(".notificationList").prepend($(`<div class="dropdown-item">${Text}</div>`));
            }
            
        });

        $('.Cform').submit('.CommentForm',function(event){
            createComment(event,self,this);
        });

        self.socket.on("sendingCommentNotiToPerson",function(data){
            if(self.selfId != data.from)
            {
                // console.log("falanjsnjsncjncjs");
                new Noty({
                    theme: 'relax',
                    text: `<a href="/profile/${data.from}">${data.name}</a> commented on your post`,
                    type: 'success',
                    layout: 'bottomLeft',
                    timeout: 1500
                    
                }).show();

                // adding notification to frontend
                

            }
            
        });
        
        $("#peopleForm").on("click", ".toggle_friend",function(event){
            console.log("*****************************");
            toggle_friend(event,self,this);
        } );

        self.socket.on("addingRemFriendToPerson",function(data){
            if(self.selfId != data.data.id1){
                if(data.data.task=="Add")
                {
                    // add to friendReqList
                    new Noty({
                        theme: 'relax',
                        text: `<a href="/profile/${data.data.id1}">${data.data.name1}</a> send you friend request
                        
                        `,
                        // <a class="toggle_friend" href="/friends/addRemoveFriend/?task=Accept&id=${data.data.id1}">Accept</a>
                        // <a class="toggle_friend" href="/friends/addRemoveFriend/?task=Reject&id=${data.data.id1}">Reject</a>
                        type: 'success',
                        layout: 'bottomLeft',
                        timeout: 1500
                        
                    }).show();
                    console.log(`in ${data.data.task}ing area`);
                    let newPost = friendReqList(data.data.id1,data.data.name1);
                    $(`#usersProfile-${data.data.id1}`).remove();
                    $("#FriendRequestList").prepend(newPost);

                }else if(data.data.task=="Remove"){
                    // add to General List
                    console.log(`in ${data.data.task}ing area`);
                    let newPost = generalList(data.data.id1,data.data.name1);
                    $(`#usersProfile-${data.data.id1}`).remove();
                    $("#GeneralusersList").prepend(newPost);

                }else if(data.data.task=="Accept"){
                    // add to friendList
                    console.log(`in ${data.data.task}ing area`);
                    let newPost = friendList(data.data.id1,data.data.name1);
                    $(`#usersProfile-${data.data.id1}`).remove();
                    $("#FriendusersList").prepend(newPost);
                    new Noty({
                        theme: 'relax',
                        text: `<a href="/profile/${data.data.id1}">${data.data.name1}</a> accepted your friend request`,
                        type: 'success',
                        layout: 'bottomLeft',
                        timeout: 1500
                        
                    }).show();

                }else if(data.data.task=="Reject"){
                    // add to generalList
                    console.log(`in ${data.data.task}ing area`);
                    let newPost = generalList(data.data.id1,data.data.name1);
                    $(`#usersProfile-${data.data.id1}`).remove();
                    $("#GeneralusersList").prepend(newPost);

                }else if(data.data.task=="Cancel"){
                    // add to generalList
                    console.log(`in ${data.data.task}ing area`);
                    let newPost = generalList(data.data.id1,data.data.name1);
                    $(`#usersProfile-${data.data.id1}`).remove();
                    $("#GeneralusersList").prepend(newPost);
                }
            }
        });

    }


    

}
