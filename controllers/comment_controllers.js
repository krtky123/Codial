const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const CommentMailer = require("../mailers/commentMailer");

module.exports.createComment = async function (req, res) {
  // console.log(req);
  // console.log("**********", res.locals.user);
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let person = post.user;
      // console.log(post);
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id, ////////////////////////// doubt
      });
      post.comment.push(comment._id);
      post.save(); // as we update
      let popComment = await Comment.findById(comment.id).populate("user");
      // console.log(popComment);
      CommentMailer.newCommentMail(popComment);

      if (req.xhr) {
        // console.log(popComment);
        return res.status(200).json({
          data: {
            comment: popComment,
            person: person,
            name: req.user.name,
            from: req.user.id,
            content: post.content,
          },
          message: "comment created",
        });
      }
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "error in comment creation");
    return res.redirect("back");
  }
};

module.exports.deleteComment = async function (req, res) {
  console.log("************ falak **************");
  try {
    let comment = await Comment.findById(req.params.id);

    // .id converting objectid to string
    if (comment.user == req.user.id) {
      let postid = comment.post;
      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });
      comment.remove();
      let post = await Post.findByIdAndUpdate(postid, {
        $pull: { comment: req.params.id },
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "comment deleted",
        });
      }
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "error in comment creation");
    return res.redirect("back");
  }
};
