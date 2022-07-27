const express = require('express');
const catchAsync = require("../utils/CatchAsync");
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const Campgrounds = require('../controllers/campgrounds');

const multer = require('multer');

const {storage} = require('../cloudinary');
 
const parser = multer({ storage: storage });

const router = express.Router();

router
  .route("/")
  .get(
    catchAsync(Campgrounds.allCampgrounds)
  )
  .post(
    isLoggedIn,
    parser.array('images'),
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
.put(
    isLoggedIn,
    isAuthor,
    parser.array('images'),
    validateCampground,
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