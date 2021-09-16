const passport = require("passport");
const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt; // extract jwt from header

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "codeial"; // encryption/decryption key
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

// Middleware
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("in jwt strategy");
    User.findById(jwt_payload._id, function (err, user) {
      if (err) {
        console.log("error found");
        return done(err, false);
      }

      if (user) {
        console.log("user found");
        return done(null, user);
      } else {
        console.log("user not found");
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
