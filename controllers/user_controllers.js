const { response } = require("express");
const passport = require("passport");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const FriendRequest = require("../models/friendNotification");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

module.exports.homepage = async function (req, res) {
  // console.log(req.cookies.codial);
  // auth check in routers and user is stored in locals
  // console.log("*******", res.locals.user);
  // Post.find({},function(err,post){
  //     return res.render('profile',{
  //         title : "profile",
  //         // user : user
  //         post : post,
  //     });
  // });

  // prepopulate user with post.user
  // Post.find({})
  // .populate('user')
  // .populate({
  //     path: 'comment',
  //     populate:{
  //         path: 'user'
  //     }
  // })
  // .exec(function(err,post){
  //     User.find({},function(err,users){
  //         return res.render('profile',{
  //             title : "profile",
  //             users : users,
  //             post : post,
  //         });
  //     });

  // })

  // using async await
  try {
    let post = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comment",
        populate: {
          path: "user",
        },
      });
    let Friendusers;
    let Generalusers;
    let Friendrequest;
    let PendingRequest;

    if (req.user) {
      Friendusers = await User.find({ _id: { $in: req.user.friendList } });
      Friendrequest = await User.find({ _id: { $in: req.user.friendReqList } });
      PendingRequest = await User.find({ _id: { $in: req.user.pendingList } });
      var children = Friendusers.concat(Friendrequest);
      var finalC = PendingRequest.concat(children);
      Generalusers = await User.find({ _id: { $nin: finalC } });
    }

    return res.render("profile", {
      post: post,
      title: "profile",
      Friendusers: Friendusers,
      Generalusers: Generalusers,
      Friendrequest: Friendrequest,
      PendingRequest: PendingRequest,
    });
  } catch (err) {
    console.log(err);
    return;
  }

  // if(req.cookies.user_id){

  //     User.findById(req.cookies.user_id,function(err,user){
  //         if(user)
  //         {
  //             return res.render('profile',{
  //                 title : "profile",
  //                 user : user
  //             });
  //         }
  //         else{
  //             return res.redirect('/users/signup');
  //         }
  //     });
  // }
  // else{
  //     return res.redirect('/users/signup');
  // }
  // return res.render('profile',{
  //     title : "profile",
  // });
};

module.exports.profilepage = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    return res.render("userinfo", {
      title: "user-info",
      profile: user,
    });
  });
};

module.exports.profileUpdate = async function (req, res) {
  try {
    if (req.user.id == req.params.id) {
      // let user = await User.findByIdAndUpdate(req.params.id,req.body);
      let user = await User.findById(req.params.id);
      User.uploadAvatar(req, res, function (err) {
        if (err) {
          console.log("*********(Multer error)*******");
          return;
        } else {
          user.name = req.body.name;
          user.email = req.body.email;
          if (req.file) {
            if (user.avatar) {
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
            }
            user.avatar = User.avatarPath + "/" + req.file.filename;
          }
          console.log(req.file);
          console.log(user.avatar);
        }
        user.save();
        return res.redirect("back");
      });
    } else {
      return res.status(401).send("Unauth access");
    }
  } catch {
    console.log(err);
    return;
  }
};

module.exports.create = function (req, res) {
  // console.log(req.body);
  if (req.body.password != req.body.password2) {
    req.flash("error", "password not matches");
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (error, user) {
    if (error) {
      req.flash("error", "some error occured in singup");
      return res.redirect("back");
    }
    if (!user) {
      User.create(req.body, function (error, user) {
        if (error) {
          console.log("error in creating user ");
          console.log(error);
          return;
        }
        user.password = user.generateHash(req.body.password);
        user.save();
        return res.redirect("/signin");
      });
    } else {
      req.flash("error", `user with ${req.body.email} email already exist`);
      return res.redirect("back");
    }
  });
};

// manual auth
// module.exports.createSession = function(req,res){

//     User.findOne({email:req.body.email}, function(error,user){
//         if(error){
//             console.log("error in signin");
//             return;
//         }
//         if(user){
//             if(user.password == req.body.password){
//                 // cookie is sent to browser by server
//                 res.cookie('user_id',user.id);
//                 return res.redirect('/users/profile');
//             }else{
//                 return res.redirect('back');
//             }
//         }
//         else{
//             return res.redirect('back');
//         }
//     });
// }

// using passport
module.exports.createSession = function (req, res) {
  // console.log(req.cookies);
  console.log("falak");
  if (req) {
    req.flash("success", "Logged in successfully"); ///////////////////////////////////doubt
  }
  //   console.log(req, res);

  // res.locals.flash = {
  //     'success' : 'Signup page',
  // }
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "Logout in successfully");

  return res.redirect("/signin");
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  // res.locals.flash = {
  //     'success' : 'Signup page',
  // }
  return res.render("user_signup", {
    title: "Codial : Signup",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  // res.locals.flash = {
  //     'success' : 'Signin page',
  // }
  return res.render("user_signin", {
    title: "Codial : signIn",
  });
};
