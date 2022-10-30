const express = require('express');
router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/CatchAsync');
const { validateReview } = require('../utils/validations');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../controllers/review');
//....................Reviews Route......................
//....................Creating Reviews.......................
router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview));
//..................Deleting Reviews......................................

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(review.deleteReview)
);

module.exports = router;
