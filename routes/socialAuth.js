/** @format */

const express = require("express");
const passport = require("passport");
const router = express.Router();
require("../Auth/googleAuth")(passport);
require("../Auth/faceAuth")(passport);
require("../Auth/twitterAuth")(passport);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    console.log("S");
  }
);

router.get("/google/main", passport.authenticate("google"), (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user._id;
    res.redirect(`/?user=${user}&auth=${true}`);
  }
});

router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/main", passport.authenticate("facebook"), (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user._id;

    res.redirect(`/?user=${user}&auth=${true}`);
  }
});
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/main", passport.authenticate("github"), (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user._id;

    res.redirect(`/?user=${user}&auth=${true}`);
  }
});
module.exports = router;
