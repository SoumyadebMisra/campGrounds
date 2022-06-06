const express = require('express');
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");
const model = require("../models/campground");
const Review = require("../models/review");
const {reviewSchema} = require("../schemas");

const router = express.Router({mergeParams : true});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    next();
  };

  router.post("/",validateReview,catchAsync(async (req, res,next)=>{
    const camp = await model.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Successfully created review!')
    res.redirect(`/campgrounds/${camp._id}`);
  }));
  
  router.delete("/:reviewId",catchAsync(async (req,res)=>{
    const {id,reviewId} = req.params;
    await model.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review!');
    res.redirect("/campgrounds/"+id);
  }));

module.exports = router;