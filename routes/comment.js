const express = require('express')
const router = express.Router()
const passport = require('passport');

const comment_controllers = require('../controllers/comment_controllers');

router.post('/create',passport.checkAuthentication,comment_controllers.createComment);
router.get('/delete/:id',passport.checkAuthentication,comment_controllers.deleteComment);


module.exports = router;