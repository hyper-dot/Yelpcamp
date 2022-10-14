const Campground = require('./models/campground')
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in first');
    const nextTo = req.originalUrl;
    return res.redirect(`/login?nextTo=${nextTo}`);
  }
  next();
};
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'Opps You do not have permission to do that')
    res.redirect(`/campgrounds/${id}`)
  }
  next()
}


