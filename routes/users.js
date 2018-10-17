const express = require('express');
const csrf = require('csurf')
const passport = require('passport')

const csrfProtection = csrf()

const router = express.Router()

router.use(csrfProtection)

/* GET signup page */
router.get('/signup', function(req, res, next) {
  var message = req.flash('error')
  res.render('user/signup', { title: 'project-pos',csrfToken: req.csrfToken(), messages: message, hasOneMessage: (message.length>0) ? true : false});
});

//create a user account
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/users/signup',
  failureFlash: true
}))
/* GET login page */
router.get('/signin', function(req, res, next) {
  var message = req.flash('error')
  res.render('user/signin', { title: 'project-pos',csrfToken: req.csrfToken(), messages: message, hasOneMessage: (message.length>0) ? true : false});
});

//login
router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/users/signin',
  failureFlash: true
}))

module.exports = router;
