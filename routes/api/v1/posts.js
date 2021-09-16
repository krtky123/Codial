const express = require("express");
const router = express.Router();
const passport = require("passport");

const post_api_controllers = require("../../../controllers/api/v1/post_api");

router.get("/", post_api_controllers.index);
// router.delete('/:id', passport.authenticate('jwt', {session: false}), post_api_controllers.destroy);
router.delete(
  "/delete/:id",
  passport.authenticate(
    // './config/passportJWT''
    "jwt",
    { session: false } // to prevent session cookie generator
  ),
  post_api_controllers.destroy
);

module.exports = router;
