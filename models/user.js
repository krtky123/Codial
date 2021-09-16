const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Avatar_Path = path.join('/uploads/users/avatars');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required : true,
        unique : true
    },
    name: {
        type : String,
        required: true
    },
    password: {
        type : String,
        required: true
    },
    avatar: {
        type: String
    },
    friendList: [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
      }
    ],
    notifications: [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Notification'
      }
    ],
    friendReqList: [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
      }
    ],
    pendingList: [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
      }
    ]
  },{
      timestamps:true,
  });


  userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  };
  
  // checking if password is valid
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', Avatar_Path) );
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });

  // static function for whole class rather than object of that class
  userSchema.statics.uploadAvatar = multer({ storage: storage }).single('avatar');
  userSchema.statics.avatarPath = Avatar_Path;

  const User = mongoose.model('User',userSchema);
  module.exports = User;