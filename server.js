/** @format */

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/socialAuth"));
app.use("/", require("./routes/homeRoute"));
app.use("/user", require("./routes/userRoute"));

app.listen(port, (req, res) => {
  console.log("Server is running");
});
