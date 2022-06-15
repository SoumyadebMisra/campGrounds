const express = require('express');
const catchAsync = require("../utils/CatchAsync");
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const Campgrounds = require('../controllers/campgrounds')

const router = express.Router();

router
  .route("/")
  .get(
    catchAsync(Campgrounds.allCampgrounds)
  )
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(Campgrounds.createCampground)
  );

router.route("/new").get(isLoggedIn,Campgrounds.renderNewForm);

router.route("/:id")
.get(
  catchAsync(Campgrounds.showCampground)
)
.delete(
  isLoggedIn,
  isAuthor,
  catchAsync(Campgrounds.deleteCampground)
)
.put(validateCampground,
    isLoggedIn,
    isAuthor,
    catchAsync(Campgrounds.updateCampground)
  );


router
  .route("/:id/edit")
  .get(
    isLoggedIn,
    isAuthor,
    catchAsync(Campgrounds.renderEditForm)
  )
  

module.exports = router;