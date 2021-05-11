/** @format */

const monoose = require("mongoose");

const db = () => {
  monoose.connect(
    " mongodb+srv://Admin-Karthik:qwerty12@cluster0.semtp.mongodb.net/Musicplayer",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );
};
module.exports = db;
