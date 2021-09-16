const express = require('express')
const router = express.Router()
const passport = require('passport');

const friend_controllers = require('../controllers/friend_controllers');

router.post('/addRemoveFriend',passport.checkAuthentication,friend_controllers.addRemoveFriend);
router.get('/chat',passport.checkAuthentication,friend_controllers.chat);
router.post('/chatcreate',passport.checkAuthentication,friend_controllers.chatcreate);

module.exports = router;