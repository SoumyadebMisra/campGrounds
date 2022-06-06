require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require('connect-flash')
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const catchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");
const campground = require("./routes/campground");
const reviews = require("./routes/reviews");

const app = express();

const sessionConfig = {
  secret: "thisisabigsecret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/yelp-campDB");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/campgrounds",campground);
app.use("/campgrounds/:id/reviews",reviews);

app.route("/").get((req, res) => {
  res.render("campgrounds/home");
});



app.all("*", (req, res, next) => {
  throw new ExpressError("Page Not Found!", 404);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).send(message+"<p>"+err.stack+"</p>");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
