const express = require('express')
const router = express.Router()
const passport = require('passport');

const home_controller = require('../controllers/home_controller');

router.post('/',passport.checkAuthentication,home_controller.home);

module.exports = router;