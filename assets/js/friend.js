function pendingList(id, name){
    return $(`
        <div id="usersProfile-${id}">
        <small>
        <li>
        <a href="/profile/${id}">${name}</a>
        <a class="toggle_friend" href="/friends/addRemoveFriend/?task=Cancel&id=${id}"> Cancel Request </a>
        </li>
        </small><br>
        </div>
    `);
}


function generalList(id, name){
    return $(`
        <div id="usersProfile-${id}">
        <small>
        <li>
        <a href="/profile/${id}">${name}</a>
        <a class="toggle_friend" href="/friends/addRemoveFriend/?task=Add&id=${id}">Add Friend </a>
        </li>
        </small><br>
        </div>
    `);
}

function friendList(id, name){
    return $(`
        <div id="usersProfile-${id}">
        <small>
        <li>
        <a href="/profile/${id}">${name}</a>
        <a class="toggle_friend" href="/friends/addRemoveFriend/?task=Remove&id=${id}"> Remove Friend </a>
        <a class="chatwithFriend" href="/friends/chat/?id=${id}"> Chat </a>
        </li>
        </small><br>
        </div>
    `);
}

function friendReqList(id, name){
    return $(`
        <div id="usersProfile-${id}">
        <small>
        <li>
        <a href="/profile/${id}">${name}</a>
        <a class="toggle_friend" href="/friends/addRemoveFriend/?task=Accept&id=${id}"> Accept </a>
        <a class="toggle_friend" href="/friends/addRemoveFriend/?task=Reject&id=${id}"> Reject </a>
        </li>
        </small><br>
        </div>
    `);
}

function toggle_friend(event,self,temp){
    event.preventDefault();
    // let temp = this;
    $.ajax({
        type: 'post',
        url: $(temp).attr("href"),

        success: function(data){
           console.log(data);
            if(data.data.task=="Add")
            {
                // add to pendingList
                console.log(`in ${data.data.task}ing area`);
                let newPost = pendingList(data.data.id,data.data.name);
                $(`#usersProfile-${data.data.id}`).remove();
                $("#PendingRequestList").prepend(newPost);

            }else if(data.data.task=="Remove"){
                // add to General List
                console.log(`in ${data.data.task}ing area`);
                let newPost = generalList(data.data.id,data.data.name);
                $(`#usersProfile-${data.data.id}`).remove();
                $("#GeneralusersList").prepend(newPost);

            }else if(data.data.task=="Accept"){
                // add to friendList
                console.log(`in ${data.data.task}ing area`);
                let newPost = friendList(data.data.id,data.data.name);
                $(`#usersProfile-${data.data.id}`).remove();
                $("#FriendusersList").prepend(newPost);

            }else if(data.data.task=="Reject"){
                // add to generalList
                console.log(`in ${data.data.task}ing area`);
                let newPost = generalList(data.data.id,data.data.name);
                $(`#usersProfile-${data.data.id}`).remove();
                $("#GeneralusersList").prepend(newPost);

            }else if(data.data.task=="Cancel"){
                // add to generalList
                console.log(`in ${data.data.task}ing area`);
                let newPost = generalList(data.data.id,data.data.name);
                $(`#usersProfile-${data.data.id}`).remove();
                $("#GeneralusersList").prepend(newPost);
            }
            self.socket.emit('addRemoveFriend', data);
            
            
            
        },
        error: function(error){
            // console.log(error.responseText);
            console.log("error");
        }
    });
}
