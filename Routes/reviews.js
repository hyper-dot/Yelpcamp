const express = require('express');
router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/CatchAsync');
const { validateReview } = require('../utils/validations');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { isLoggedIn, isReviewAuthor } = require('../middleware');

//....................Reviews Route......................
//....................Creating Reviews.......................
router.post(
  '/',
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successuflly added a review');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//..................Deleting Reviews......................................

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted the Review !!!');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
