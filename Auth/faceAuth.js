/** @format */

const FacebookStratergy = require("passport-facebook").Strategy;
const User = require("../models/Users");
const Song = require("../models/Songs");

const passportFb = (passport) => {
  passport.use(
    new FacebookStratergy(
      {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL:
          "https://guarded-falls-48968.herokuapp.com/auth/facebook/main",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const fbUser = await User.findOne({ facebookId: profile.id });
          if (fbUser) {
            done(null, fbUser);
          } else {
            let date = new Date().toLocaleDateString();

            const newUser = await User({
              name: profile.displayName,
              email: profile.emails[0].value,
              facebookId: profile.id,
              profileUrl: profile.photos[0].value,
              date: date,
            });
            await newUser.save();
            done(null, newUser);
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
module.exports = passportFb;
