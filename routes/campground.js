const express = require('express');
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");
const model = require("../models/campground");
const {campgroundSchema} = require("../schemas");
const Review = require("../models/review");
const {reviewSchema} = require("../schemas");
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');

const router = express.Router();

router
  .route("/")
  .get(
    catchAsync(async (req, res, next) => {
      const camps = await model.find({});
      res.render("campgrounds/index", { campgrounds: camps });
    })
  )
  .post(
    isLoggedIn,
    validateCampground,catchAsync(async (req, res, next) => {
      const camp = new model(req.body.campground);
      camp.author = req.user._id;
      await camp.save();
      req.flash('success','Successfully created campground!');
      res.redirect(`/campgrounds/${camp._id}`);
    })
  );

router.route("/new").get(isLoggedIn,(req, res) => {
  res.render("campgrounds/new");
});

router.route("/:id")
.get(
  catchAsync(async (req, res, next) => {
    const campground = await model.findOne({ _id: req.params.id }).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    // console.log(campground);
    if(!campground){
      req.flash('error', 'Could not find the campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
  })
)
.delete(
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const camp = await model.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted campground!');
    res.redirect("/campgrounds");
    console.log("Campground deleted");
  })
)
.put(validateCampground,
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res, next) => {
      await model.findByIdAndUpdate(req.params.id, req.body.campground );
      req.flash('success','Successfully updated campground');
      res.redirect("/campgrounds/" + req.params.id);
    })
  );


router
  .route("/:id/edit")
  .get(
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res, next) => {
      const camp = await model.findById(req.params.id);
      if(!camp){
        req.flash('error', 'Could not find the campground!');
        return res.redirect('/campgrounds');
      }
      res.render("campgrounds/edit", { campground: camp });
    })
  )
  

module.exports = router;