const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const {reviewSchema,campgroundSchema} = require('./schemas');
const catchAsync = require('./utils/CatchAsync');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','User not logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    next();
  };

module.exports.isAuthor = catchAsync(async( req, res, next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    console.log(camp);
    if(!camp.author.equals(req.user._id)){
        req.flash('error','Permission denied!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
})

module.exports.isReviewAuthor = catchAsync(async( req, res, next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    // console.log(camp);
    if(!review.author.equals(req.user._id)){
        req.flash('error','Permission denied!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
})

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    next();
  };