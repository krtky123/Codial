const express = require('express')
const router = express.Router()
const passport = require('passport');

const post_controllers = require('../controllers/post_controllers');

router.post('/create',passport.checkAuthentication,post_controllers.createPost);
router.get('/delete/:id',passport.checkAuthentication,post_controllers.deletePost);
router.get('/:id',passport.checkAuthentication,post_controllers.viewPost);


module.exports = router;