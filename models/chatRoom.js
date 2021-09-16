const mongoose = require('mongoose');
const chatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    messages: [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ChatMessages', 
        }
    ]
  },{
      timestamps:true,
  });

  const ChatRoom = mongoose.model('ChatRoom',chatRoomSchema);
  module.exports = ChatRoom; 