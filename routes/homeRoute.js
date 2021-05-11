/** @format */

const express = require("express");
const router = express.Router();

const Song = require("../models/Songs");
const User = require("../models/Users");
const passport = require("passport");

router.get("/", async (req, res) => {
  if (req.query) {
    try {
      const data = await Song.find({});
      const userD = await User.findOne({ _id: req.query.user });
      res.render("home", {
        musicArray: data,
        user: req.query.user,
        userD: userD,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const data = await Song.find({});
      res.render("home", { musicArray: data });
    } catch (error) {
      console.log(error);
    }
  }
});

router.get("/music/:id", async (req, res) => {
  const userN = req.query.user;
  let songName = req.params.id;
  let currentT = req.query.currentTime;
  let duration = req.query.duration;
  let isPaused = req.query.isPaused;

  try {
    const song = await Song.findOne({ name: songName });
    const allMusicData = await Song.find({});
    const userD = await User.findOne({ _id: userN });
    res.render("music", {
      musicData: song,
      allMusicData: allMusicData,
      currentT,
      duration,
      isPaused,
      userD: userD,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    let userP = req.query.user;
    try {
      const userData = await User.findOne({ _id: userP });
      res.render("profile", { userProfile: userData });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect("/user/login");
  }
});

router.post("/update/:id", async (req, res) => {
  let updateUser = req.params.id;
  try {
    const update = await User.updateOne(
      { name: updateUser },
      {
        fbId: req.body.fb,
        instaId: req.body.insta,
        twitterId: req.body.twitter,
      }
    );
  } catch (error) {}
});

router.post("/fav/:id", async (req, res) => {
  const selname = req.params.id;
  console.log(selname);
  console.log(req.body);

  try {
    const userSong = await Song.findOne({ name: req.body.name });
    let song = {
      id: userSong._id,
      image: userSong.imageUrl,
      name: userSong.name,
      audio: userSong.audio,
    };
    const userFav = await User.updateMany(
      { _id: selname },
      {
        $push: {
          favSong: {
            $each: [
              {
                id: song.id,
                songImage: song.image,
                songName: song.name,
                audio: song.audio,
              },
            ],
          },
        },
      },
      {
        user: userSong,
      }
    );
    const favS = await Song.findOne({ name: req.body.name });
    favS.favRating = "fav";
    favS.save();

    res.redirect(`/?user=${selname}&auth=${true}`);
  } catch (error) {
    console.log(error);
  }
});

router.post("/unfav/:id", async (req, res) => {
  const userId = req.params.id;
  console.log(req.body.name);
  try {
    const unFav = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { favSong: { songName: req.body.name } } }
    );
    const unFavS = await Song.findOne({ name: req.body.name });
    unFavS.favRating = "null";
    unFavS.save();

    res.redirect(`/?user=${userId}&auth=${true}`);
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/user/login");
});

router.post("/upload/:id", async (req, res) => {
  try {
    const updateImage = await User.updateOne(
      { _id: req.params.id },
      {
        profileUrl: req.body.url,
      }
    );
    res.json({ mes: "updated", upadate: true });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
