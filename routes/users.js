const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controllers = require("../controllers/user_controllers");

router.get("/signin", user_controllers.signIn);
router.get("/signup", user_controllers.signUp);
router.post("/create", user_controllers.create);
router.post(
  "/createSession",
  passport.authenticate(
    "local", //  passport.use
    { failureRedirect: "/signin" }
  ),
  user_controllers.createSession
);
router.get("/signout", user_controllers.destroySession);

router.get("/", user_controllers.homepage);
router.get(
  "/profile/:id",
  passport.checkAuthentication,
  user_controllers.profilepage
);
router.post(
  "/update/:id",
  passport.checkAuthentication,
  user_controllers.profileUpdate
);

// router.post('/createSession',user_controllers.createSession);

// 2nd arg is middleware, use passport as middleware to auth
router.get(
  "/users/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// callback from google
router.get(
  "/users/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/signin",
  }) //////////////////////////////////////////////////////////////////////// user_controllers.createSession is not working
);

router.get(
  "/users/auth/outlook",
  passport.authenticate("windowslive", {
    scope: [
      "openid",
      "profile",
      "offline_access",
      "https://outlook.office.com/Mail.Read",
    ],
  })
);

router.get(
  "/auth/outlook/callback",
  passport.authenticate("windowslive", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
