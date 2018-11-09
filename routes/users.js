const express = require('express');
const csrf = require('csurf')
const passport = require('passport')

const Middlewares = require('../middlewares/middlewares')
const controller = require('../controllers/userController')

const csrfProtection = csrf()
const router = express.Router()


router.use(csrfProtection)

/* GET signup page */
router.get('/signup', Middlewares.notLoggedIn, controller.getSignUp);
//create a user account
router.post('/signup',Middlewares.notLoggedIn, passport.authenticate('local-signup', {
  failureRedirect: '/users/signup',
  failureFlash: true
}), controller.signUp)
/* GET login page */
router.get('/signin', Middlewares.notLoggedIn, controller.getSignIn);

//login
router.post('/signin', Middlewares.notLoggedIn, passport.authenticate('local-signin', {
  // successRedirect: '/',
  failureRedirect: '/users/signin',
  failureFlash: true
}), controller.signIn)

router.get('/logout', Middlewares.isLoggedIn, controller.getLogout)

module.exports = router;
