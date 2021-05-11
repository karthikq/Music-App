/** @format */

const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/Users");

const passportGit = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GH_CLIENT_ID,
        clientSecret: process.env.GH_CLIENT_SECRECT,
        callbackURL:
          "https://guarded-falls-48968.herokuapp.com/auth/github/main",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = await User.findOne({ githubId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            let date = new Date().toLocaleDateString();
            const user = new User({
              githubId: profile.id,
              name: profile.username.replace(/\s/g, ""),
              email: profile.nodeId,
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
module.exports = passportGit;
