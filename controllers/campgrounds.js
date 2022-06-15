const Campground = require('../models/campground');

module.exports.allCampgrounds = async (req, res, next) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index", { campgrounds: camps });
  }

module.exports.createCampground = async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success','Successfully created campground!');
    res.redirect(`/campgrounds/${camp._id}`);
  }

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new');
  }

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findOne({ _id: req.params.id }).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    // console.log(campground);
    if(!campground){
      req.flash('error', 'Could not find the campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
  }

module.exports.deleteCampground = async (req, res, next) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted campground!');
    res.redirect("/campgrounds");
    console.log("Campground deleted");
  }

module.exports.updateCampground = async (req, res, next) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground );
    req.flash('success','Successfully updated campground');
    res.redirect("/campgrounds/" + req.params.id);
  }

module.exports.renderEditForm = async (req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
      req.flash('error', 'Could not find the campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campground: camp });
  }

