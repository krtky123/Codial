const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const Notificaion = require("../models/notification");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true, 
    },
    function (req, email, password, done) {
      console.log("in passport-locals");
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          req.flash("error", err);
          return done(err);
        }
        if (!user) {
          req.flash("error", "email is wrong");
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          req.flash("error", "password is wrong");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log("serializeUser");
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("deserializeUser");
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }

    return done(null, user);
  });
});

// MW set users for views
passport.setAuthUser = async function (req, res, next) {
  console.log("setAuthUser");
  if (req.isAuthenticated()) {
    console.log("In--setAuthUser");
    res.locals.user = await User.findById(req.user._id).populate(
      "notifications"
    );
  }
  next();
};

// check user auth by our own middleware fun

passport.checkAuthentication = function (req, res, next) {
  console.log("checkAuthentication");
  if (req.isAuthenticated()) {
    // Passport fun
    return next(); // pass to controllers
  } else {
    return res.redirect("/signup");
  }
};

module.exports = passport;
