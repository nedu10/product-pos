const express = require('express');
const csrf = require('csurf')
const passport = require('passport')

const Middlewares = require('../middlewares/middlewares')
const User = require('../models/users')

const csrfProtection = csrf()
const router = express.Router()


router.use(csrfProtection)

/* GET signup page */
router.get('/signup', Middlewares.notLoggedIn, function(req, res, next) {
  var message = req.flash('error')
  res.render('user/signup', { 
    title: 'project-pos',
    csrfToken: req.csrfToken(), 
    messages: message, 
    hasOneMessage: (message.length>0) ? true : false,
    sidebar_active: {signup: true}});
});

//create a user account
router.post('/signup',Middlewares.notLoggedIn, passport.authenticate('local-signup', {
  failureRedirect: '/users/signup',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl
    req.session.oldUrl = null
    return res.redirect(oldUrl)
  } else {
    return res.redirect('/')
  }
})
/* GET login page */
router.get('/signin', Middlewares.notLoggedIn, function(req, res, next) {
  var message = req.flash('error')
  res.render('user/signin', { title: 'project-pos',
  csrfToken: req.csrfToken(),
   messages: message,
    hasOneMessage: (message.length>0) ? true : false,
    sidebar_active: {login: true}
  });
});

//login
router.post('/signin', Middlewares.notLoggedIn, passport.authenticate('local-signin', {
  // successRedirect: '/',
  failureRedirect: '/users/signin',
  failureFlash: true
}), (req, res, next) => {
  console.log('csfsgg >> ',req.user);
  User.update({email: req.user.email}, {$set: {logged_in: true}})
  .exec()
  .then(response => {
    req.session.current_user = req.user

    console.log('nnnnnnnn >> ',req.user)
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl
      req.session.oldUrl = null
      return res.redirect(oldUrl)
    } else {
      return res.redirect('/')
    }
  })
  .catch(err => {
    console.log(err)
    return err
  })
 
})

router.get('/logout', (req, res, next) => {
  User.update({email: req.user[0].email}, {$set: {logged_in: false}})
  .exec()
  .then(response => {
    console.log(req.user[0].email);
    
    console.log(response)
    req.logout()
    return res.redirect('/')
  })
  .catch(err => {
    console.log(err)
    return err
  })
})




module.exports = router;
