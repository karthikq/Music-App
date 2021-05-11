/** @format */

const monoose = require("mongoose");

const db = () => {
  monoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};
module.exports = db;
