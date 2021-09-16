const Post = require('../models/post')
const Comment = require('../models/comment')
const User = require('../models/user')
const Like = require('../models/like')
const Notificaion = require('../models/notification')

module.exports.likeContent = async function(req,res){
    try{
        let likeableThing;
        let dislike = false;
        let person;
        if(req.query.tag == "Post"){
            likeableThing = await Post.findById(req.query.id);
        }else if(req.query.tag == "Comment"){
            likeableThing = await Comment.findById(req.query.id);
        }else{
            // flash msg
        }
        person = likeableThing.user;
        let Fullperson = await User.findById(person);
        let likeThing = await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.tag
        });
        let notification;
        if(likeThing){
            // delete that like
            let tempN = await Notificaion.findOne({
                user: person._id,
                content: `${req.query.tag} ${likeableThing.content} is liked by <a href="/users/profile/${req.user.id}"> ${req.user.name}</a>`
            });
            console.log(tempN._id);
            Fullperson.notifications.pull(tempN._id);
            Fullperson.save();

            tempN.remove();
            console.log("******* like deleted ********"); 
            likeableThing.likes.pull(likeThing._id);
            likeableThing.save();
            likeThing.remove();
            dislike = true;
            
        }else{
            console.log("******* like added ********"); 
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.tag
            });
            likeableThing.likes.push(newLike._id);
            likeableThing.save();
            notification = await Notificaion.create({
                user: person._id,
                content: `${req.query.tag} ${likeableThing.content} is liked by <a href="/users/profile/${req.user.id}"> ${req.user.name}</a>`
            });
            Fullperson.notifications.push(notification._id);
            Fullperson.save();
        }
        return res.json(200, {
            message: "Request successful!",
            data: {
                dislike: dislike,
                person: person,
                name: req.user.name,
                likeableThing: likeableThing._id,
                tag: req.query.tag,
                from: req.user.id,
                content : likeableThing.content,
                notifiation_id : notification,
            }
        })
    }catch(err){
        console.log(err);
        return;
    }
}