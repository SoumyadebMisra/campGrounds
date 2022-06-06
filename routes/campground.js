const express = require('express');
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");
const model = require("../models/campground");
const {campgroundSchema} = require("../schemas");
const Review = require("../models/review");
const {reviewSchema} = require("../schemas");

const router = express.Router();


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    next();
  };

router
  .route("/")
  .get(
    catchAsync(async (req, res, next) => {
      const camps = await model.find({});
      res.render("campgrounds/index", { campgrounds: camps });
    })
  )
  .post(
    validateCampground,catchAsync(async (req, res, next) => {
      const camp = new model(req.body.campground);
      await camp.save();
      req.flash('success','Successfully created campground!');
      res.redirect(`/campgrounds/${camp._id}`);
    })
  );

router.route("/new").get((req, res) => {
  res.render("campgrounds/new");
});

router.route("/:id")
.get(
  catchAsync(async (req, res, next) => {
    const campground = await model.findOne({ _id: req.params.id }).populate('reviews');
    if(!campground){
      req.flash('error', 'Could not find the campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
  })
)
.delete(
  catchAsync(async (req, res, next) => {
    const camp = await model.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted campground!');
    res.redirect("/campgrounds");
    console.log("Campground deleted");
  })
)
.put(validateCampground,
    catchAsync(async (req, res, next) => {
      await model.findByIdAndUpdate(req.params.id, req.body.campground );
      req.flash('success','Successfully updated campground');
      res.redirect("/campgrounds/" + req.params.id);
    })
  );


router
  .route("/:id/edit")
  .get(
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