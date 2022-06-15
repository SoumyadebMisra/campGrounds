const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/CatchAsync");
const Users = require("../controllers/users");

router.get("/register", Users.renderRegister);

router.post("/register", catchAsync(Users.register));

router
  .route("/login")
  .get(Users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    Users.login
  );

router.get("/logout", Users.logout);

module.exports = router;
