const express = require('express');
const catchAsync = require("../utils/CatchAsync");
const model = require("../models/campground");
const Review = require("../models/review");

const router = express.Router({mergeParams : true});

const {validateReview,isReviewAuthor,isLoggedIn} = require('../middleware')

  router.post("/",isLoggedIn,validateReview,catchAsync(async (req, res,next)=>{
    const camp = await model.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    camp.reviews.push(review);
    await camp.save();
    req.flash('success', 'Successfully created review!')
    res.redirect(`/campgrounds/${camp._id}`);
  }));
  
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(async (req,res)=>{
    const {id,reviewId} = req.params;
    await model.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review!');
    res.redirect("/campgrounds/"+id);
  }));

module.exports = router;