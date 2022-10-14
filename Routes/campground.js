const express = require('express');
router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const { validateCampground } = require('../utils/validations');
const ExpressError = require('../utils/ExpressErrors');
const Campground = require('../models/campground');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const session = require('express-session');

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
    req.flash('error','Opps You do not have permission to do that') 
    res.redirect(`/campgrounds/${id}`)
    }
  next()
}


//...................All Campgrounds..................
router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

//....................New Campground.....................
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a campground !!!');
    res.redirect(`campgrounds/${campground._id}`);
  })
);

//......................Show campground.................
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id)
      .populate('reviews')
      .populate('author');
    if (!campground) {
      req.flash('error', 'Opps cannot find the campground!!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  })
);

//...................Edit campground..............
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
      const {id} = req.params;
      const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully Updated campground !!!');
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'Opps cannot find the campground!!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);

//................Delete Campground...............
router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground !!');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
