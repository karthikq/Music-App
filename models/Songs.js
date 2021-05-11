/** @format */

const mongoose = require("mongoose");
const db = require("../mongoose/connection");

db();

const SongSchema = new mongoose.Schema({
  name: String,
  rating: String,
  imageUrl: String,
  backgUrl: String,
  audio: String,
  favRating: String,

  fav: {
    type: Boolean,
    default: false,
  },
});

const Song = mongoose.model("Song", SongSchema);

module.exports = Song;
