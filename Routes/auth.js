const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const passport = require('passport');
const auth = require('../controllers/auth');

router
  .route('/register')
  .get((req, res) => {
    res.render('auth/register');
  })
  .post(catchAsync(auth.addUser));

router
  .route('/login')
  .get(auth.renderLoginForm)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    auth.reqLogin
  );

router.get('/logout', auth.reqLogout);
module.exports = router;
