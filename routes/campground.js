const express = require('express');
const catchAsync = require("../utils/CatchAsync");
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const Campgrounds = require('../controllers/campgrounds');

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router
  .route("/")
  .get(
    catchAsync(Campgrounds.allCampgrounds)
  )
  // .post(
  //   isLoggedIn,
  //   validateCampground,
  //   catchAsync(Campgrounds.createCampground)
  // );
  .post(upload.single('image'),(req,res)=>{
    res.send('OK');
    console.log(req.body,req.file);
  })

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