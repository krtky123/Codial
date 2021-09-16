const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
const Like = require("../../../models/like");

module.exports.index = async function (req, res) {
  console.log("*************API POSTS FETCH ***********");
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comment",
        populate: {
          path: "user",
        },
      });
    return res.json(200, {
      message: "list of post",
      posts: posts,
    });
  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  console.log("*************API DELETE ***********");

  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      post.remove();

      await Like.deleteMany({ likeable: post._id, onModel: "Post" });
      let popComment = await Comment.find({ post: post._id });
      for (c of popComment) {
        // console.log("***********",c);
        await Like.deleteMany({ _id: { $in: c.likes } });
      }

      await Comment.deleteMany({ post: req.params.id });

      return res.json(200, {
        data: {
          post_id: req.params.id,
        },
        message: "post deleted",
      });
    } else {
      return res.json(401, {
        message: "not auth to delete deleted",
      });
    }
  } catch (err) {
    // req.flash("error", "error in post deletion");
    return res.json(501, {
      message: "internal server error",
    });
  }
};
