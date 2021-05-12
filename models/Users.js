/** @format */

const mongoose = require("mongoose");
const db = require("../mongoose/connection");

db();

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    googleId: String,
    facebookId: String,
    githubId: String,
    profileUrl: String,
    fbId: String,
    instaId: String,
    twitterId: String,
    password: {
      type: String,
    },
    date: String,

    favSong: [
      {
        id: String,
        songImage: String,
        songName: String,
        audio: String,
        favRating: String,
      },
    ],
  },
  {
    timestamps: (currentTime) => {
      new Date();
    },
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
