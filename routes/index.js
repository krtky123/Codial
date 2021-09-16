const express = require('express')
const router = express.Router()

console.log("router loaded");
const homeController = require('../controllers/home_controller');

router.use('/', require('./users'));
router.use('/posts', require('./post'));
router.use('/comment', require('./comment'));
router.use('/likes', require('./like'));
router.use('/friends', require('./friend'));
router.use('/api',require('./api'));



module.exports = router;