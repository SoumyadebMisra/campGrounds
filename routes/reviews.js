const express = require("express");
const catchAsync = require("../utils/CatchAsync");
const model = require("../models/campground");
const Review = require("../models/review");
const Reviews = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

const { validateReview, isReviewAuthor, isLoggedIn } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(Reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(Reviews.deleteReview)
);

module.exports = router;
