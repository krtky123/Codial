const passport = require("passport");
const OutlookStrategy = require("passport-outlook").Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const { OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET } = require("../password");

passport.use(
  new OutlookStrategy(
    {
      clientID: OUTLOOK_CLIENT_ID,
      clientSecret: OUTLOOK_CLIENT_SECRET,
      authority: "https://login.microsoftonline.com/common",
      callbackURL: "http://localhost:8000/auth/outlook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken);
      console.log(profile);
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("error in google auth", err);
          return;
        }

        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log(
                  "error in creating user google strategy-passport",
                  err
                );
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
