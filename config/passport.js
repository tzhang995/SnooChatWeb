// config/passport.js
var RedditStrategy = require('passport-reddit').Strategy;

var User       = require('../app/user');

// expose this function to our app using module.exports
module.exports = function(passport) {
  passport.use(new RedditStrategy({
      clientID: "ffmT2Lt4iR6laA",
      clientSecret: "iYZk7wr9uoa6KElYnA6u0PYtE1A",
      callbackURL: "http://localhost:8080/auth/reddit/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  ));
};
