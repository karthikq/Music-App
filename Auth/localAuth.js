/** @format */

const LocalStartergy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/Users");

const LocalAuth = (passport) => {
  passport.use(
    new LocalStartergy(
      { usernameField: "email", passwordField: "password" },
      function (username, password, done) {
        User.findOne({ email: username }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) return done(null, false, { message: "user not found" });
          if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
              if (result) {
                return done(null, user);
              } else {
                return done(null, false, { message: "password is incorrect" });
              }
            });
          }
        });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
module.exports = LocalAuth;
