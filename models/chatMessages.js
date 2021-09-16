const mongoose = require('mongoose');
const chatMessagesSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
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
    chatRoom: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Chatroom', 
        required: true
    }
  },{
      timestamps:true,
  });

  const ChatMessages = mongoose.model('ChatMessages',chatMessagesSchema);
  module.exports = ChatMessages; 