/** @format */

const monoose = require("mongoose");

const db = async () => {
  try {
    const db = await monoose.connect(
      "mongodb+srv://Admin-Karthik:qwerty12@cluster0.semtp.mongodb.net/Musicplayer",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = db;
