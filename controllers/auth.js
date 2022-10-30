const User = require('../models/user');
module.exports.addUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome to Yelpcamp!!');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
};

module.exports.renderLoginForm = (req, res) => {
  if (req.query.nextTo) {
    const postRoute = `/login?nextTo=${req.query.nextTo}`;
    return res.render('auth/login', { postRoute });
  }
  postRoute = '/login';
  res.render('auth/login', { postRoute });
};

module.exports.reqLogin = (req, res) => {
  // console.log(req.query.nextTo);
  if (!req.query.nextTo) {
    req.flash('success', 'Welcome Back !!');
    return res.redirect('/campgrounds');
  }
  const { nextTo } = req.query;
  req.flash('success', 'Welcome Back !!');
  res.redirect(nextTo);
};

module.exports.reqLogout = (req, res, next) => {
  req.logout((e) => {
    if (e) {
      return next(e);
    }
    req.flash('success', 'Successfully Logged Out!!!');
    res.redirect('/campgrounds');
  });
};
