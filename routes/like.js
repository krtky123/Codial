const express = require('express')
const router = express.Router()
const passport = require('passport');

const like_controllers = require('../controllers/like_controllers');

router.post('/',passport.checkAuthentication,like_controllers.likeContent);


module.exports = router;