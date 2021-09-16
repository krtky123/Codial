const mongoose = require('mongoose');
const friendNotificationSchema = new mongoose.Schema({
    from: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User', 
        required: true
    },
    to: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User', 
        required: true
    },
  },{
      timestamps:true,
  });

  const friendNotification = mongoose.model('friendNotification',friendNotificationSchema);
  module.exports = friendNotification; 