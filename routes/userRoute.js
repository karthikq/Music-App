/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const saltRounds = 10;
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  body("email").isEmail().withMessage("Enter valid email"),
  check("email").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) return Promise.reject("E-mail already in use");
    });
  }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("password must be long")
    .matches(/\d/)
    .withMessage("password must contain a number"),
  body("name").isString(),
  check("name").custom((value) => {
    return User.findOne({ name: value }).then((user) => {
      if (user) return Promise.reject("username already exists");
    });
  }),
  async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = validationResult(req);

    let errorArray = [];

    if (password !== password2) {
      errorArray.push({ msg: "password doesn't match" });
    }

    if (!errors.isEmpty()) {
      let msg = errors.array()[0].msg;
      errorArray.push({ msg: msg });
    }
    if (errorArray.length > 0) {
      res.render("register", { errorArray: errorArray, name, email });
    }

    let date = new Date().toDateString();
    try {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        const user = new User({
          name: name.replace(/\s/g, ""),
          email: email,
          date: date,
          password: hash,
        });
        await user.save();
      });
    } catch (error) {
      if (error) {
        errorArray.push({ msg: "username already exists" });
        if (errorArray.length > 0) {
          res.render("register", { errorArray: errorArray });
        }
      }
    }
  }
);

module.exports = router;
