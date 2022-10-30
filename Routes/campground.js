const express = require('express');
router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const { validateCampground } = require('../utils/validations');
const Campground = require('../models/campground');
const campground = require('../controllers/campgrounds');
const { isLoggedIn } = require('../middleware');

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
router
  .route('/')
  .get(catchAsync(campground.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campground.createCampground)
  );
//....................New Campground.....................
router.get('/new', isLoggedIn, campground.renderNewForm);

//......................Show campground.................
router
  .route('/:id')
  .get(catchAsync(campground.showCampground))
  //...................Edit campground..............
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campground.editCampground)
  )
  //................Delete Campground...............
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campground.renderEditForm)
);


module.exports = router;
