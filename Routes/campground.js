const express = require('express');
router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const { validateCampground } = require('../utils/validations');
const ExpressError = require('../utils/ExpressErrors');
const Campground = require('../models/campground');
const campground = require('../controllers/campgrounds');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const session = require('express-session');

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'Opps You do not have permission to do that');
    res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//...................All Campgrounds..................
router.get('/', catchAsync(campground.index));

//....................New Campground.....................
router.get('/new', isLoggedIn, campground.renderNewForm);

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(campground.createCampground)
);

//......................Show campground.................
router.get('/:id', catchAsync(campground.showCampground));

//...................Edit campground..............
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campground.editCampground)
);

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campground.renderEditForm)
);

//................Delete Campground...............
router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(campground.deleteCampground)
);

module.exports = router;
