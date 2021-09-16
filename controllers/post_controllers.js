const Post = require('../models/post')
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.createPost = async function(req,res){
    // console.log(req);
    // console.log("**********", res.locals.user);

    
    // Post.create({
    //     content : req.body.content,
    //     user : req.user._id    ////////////////////////// doubt
    // },function(err,post){
    //     if(err){
    //         console.log("error in post");
    //         return;
    //     }
    //     return res.redirect('back');
    // });
    try{
        let post = await Post.create({
            content : req.body.content,
            user : req.user._id    ////////////////////////// doubt
        });
        
        // if ajax request
        if(req.xhr){
            let popPost = await Post.findById(post.id)
            .populate('user')
            .populate({
                path: 'comment',
                populate:{
                    path: 'user'
                }
            });
            console.log("after data");
            return res.status(200).json({
                data: {
                    post: popPost,
                    user: req.user,
                },
                message: "post created",
            });
        }

        req.flash("success", "post-created");
        return res.redirect('back');
    }catch(err){
        req.flash("error", "error in post creation");
        return res.redirect('back');
    }
    
}

module.exports.deletePost = async function(req,res){
    // console.log(req);
    // console.log("**********", res.locals.user);

    
    // Post.findById(req.params.id,function(err,post){
    //     if(err){
    //         console.log("error in deleting the post");
    //         return;
    //     }
    //     // .id converting objectid to string
    //     if(post.user == req.user.id){
    //         post.remove();
    //         Comment.deleteMany({post:req.params.id},function(err){
    //             return res.redirect('back');
    //         });

    //     }
    //     else{
    //         return res.redirect('back');
    //     }
    // });
    try{
        
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();

            await Like.deleteMany({likeable:post._id, onModel:'Post'});
            let popComment = await Comment.find({post: post._id});
            for(c of popComment){
                // console.log("***********",c);
                await Like.deleteMany({_id: {$in: c.likes}});
            }

            await Comment.deleteMany({post:req.params.id});
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id : req.params.id,
                    },
                    message: "post deleted",
                });
            }

            req.flash("success", "post-deleted");

            return res.redirect('back');
        }
        else{
            req.flash("error", "don't do inspect element");
            return res.redirect('back');
        }
    }catch(err){
        req.flash("error", "error in post deletion");
        return res.redirect('back');
    }
    

    
}

module.exports.viewPost = async function(req,res){
    try{
        let post = await Post.findById(req.params.id)
        .populate('user')
        .populate({
            path: 'comment',
            populate:{
                path: 'user'
            }
        });;
        return res.render('post_info',{
            post: post,
            title: "post",
        });
       
    }catch(err){
        req.flash("error", "error in post deletion");
        return res.redirect('back');
    }
}