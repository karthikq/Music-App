/** @format */

const User = require("../models/Users");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const passportAuth = async (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GL_CLIENT_ID,
        clientSecret: process.env.GL_CLIENT_SECRECT,
        callbackURL:
          "https://guarded-falls-48968.herokuapp.com/auth/google/main",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          } else {
            let date = new Date().toLocaleDateString();
            const user = new User({
              googleId: profile.id,
              name: profile.displayName.replace(/\s/g, ""),
              email: profile.emails[0].value,
              profileUrl: profile.photos[0].value,
              date: date,
            });
            await user.save();
            return done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
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
module.exports = passportAuth;
