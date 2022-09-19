const { campgroundSchema } = require('../schemas');
const ExpressError = require('./ExpressErrors');

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 500);
  } else {
    next();
  }
};
