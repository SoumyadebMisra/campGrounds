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
const campgroundRoutes = require("./routes/campground");
const userRoutes = require('./routes/users');
const reviewRoutes = require("./routes/reviews");
const User = require('./models/user');

const passport = require('passport');
const localStrategy = require('passport-local');

const app = express();

mongoose.connect("mongodb://localhost:27017/yelp-campDB");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sessionConfig = {
  secret: "thisisabigsecret",
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly: true,
    expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// app.use(passport.authenticate('session'));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res,next)=>{
  console.log(req.session);
  res.locals.redirectTo = undefined;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
})

app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/reviews",reviewRoutes);
app.use('/',userRoutes);

app.get('/fakeUser',catchAsync(async (req, res)=>{
  const user = new User({email:'soumy@gmail.com',username:'Soumya'});
  const newUser = await User.register(user,'monkey');
  res.send(newUser);
}))

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
