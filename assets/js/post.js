
// method to submit the form data for new post using AJAX
let createNewPost = function(event){
    event.preventDefault();
    let postformCreate = $('#postformCreate');
    $.ajax({
        type: 'post',
        url: "/posts/create",
        data: postformCreate.serialize(), // convert form data into JSON
        
        // after success data is returned from controller
        success: function(data){
            console.log("before data");
            console.log(data);

            let newPost = newpost(data.data.post, data.data.user);
            $('#postlist').prepend(newPost);
            $('#posttextarea').val('');
            $(`#commentForm-${data.data.post._id}`).bind('submit',createComment);
            // deletePost($(' .deletepost', newPost));
            new Noty({
                theme: 'relax',
                text: "Post published!",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
            }).show();
            
        },
        error: function(error){
            console.log(error.responseText);
        }
    });
};



// method to create a post in DOM
let newpost = function(post, user){
    console.log(`${post._id}`);
    return $(`
            
            <div id="post-${post._id}">
            <li>
            <p><h2>${post.content}</h2><br> 
            <small>
                ${post.user.name}<br>
                <a class="deletePostAnchor" href="/posts/delete/${post._id}">delete post</a>
                <a class="Likes" href="/likes/?tag=Post&id=${post._id} " data-likes="${post.likes.length}">${post.likes.length} Like</a>
            </small></p> 
            </li>
            <a href="/posts/${post._id} "> View</a>
            <div class="Cform">
            <form class="CommentForm" id="commentForm-${post._id}" action="/comment/create/" method="POST">
            <textarea name="content" cols="20" rows="2" placeholder="type here..." required></textarea>
            <input type="hidden" name="post" value="${post._id}">
            <input type="submit" value="Add comment">
            </form>
            </div>
            <ul class="commentlist" id="commentlist-${post._id}">
            </ul>

            </div>
            `
);}

function deletePost(event){
    let temp = this;
    console.log("falak in deletepost");
    event.preventDefault();
    // console.log(event);
    console.log(temp);
    let pathurl = $(temp).attr("href");
    // let postformCreate = $('#postformCreate');
    $.ajax({
        type: 'get',
        url: pathurl,

        success: function(data){
            // console.log(data);
            $(`#post-${data.data.post_id}`).remove();
            new Noty({
                theme: 'relax',
                text: "Post deleted!",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
            }).show();
            
        },
        error: function(error){
            // console.log(error.responseText);
            console.log("error");
        }
    });
}

function postLikes(event){
    event.preventDefault();
    let pathurl = $(this).attr("href");
    $.ajax({
        type: 'POST',
        url: pathurl,
        success: function(data){
            // console.log(data);
            $(`#post-${data.data.post_id}`).remove();
            new Noty({
                theme: 'relax',
                text: "Post deleted!",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
            }).show();
            
        },
        error: function(error){
            // console.log(error.responseText);
            console.log("error");
        }
    });
}

$("#postlist").on("click", ".deletePostAnchor", deletePost);
$("#postformCreate").submit( createNewPost);




// document.querySelector(".selectb").onclick =function(event){
//     console.log('button clicked');
//     $('#buttons').prepend(addButton);
// }

// document.querySelector(".selectb").onclick(function(event){
//     console.log('button clicked');
//     $('#buttons').prepend(addButton);
// })

// let addButton = function(){
//     console.log('function clicked');
//     return $(`
//     <button class="selectb" value="TEMP"> Button</button>`);
// }