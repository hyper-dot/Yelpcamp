module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in first');
    const nextTo = req.originalUrl;
    return res.redirect(`/login?nextTo=${nextTo}`);
  }
  next();
};
