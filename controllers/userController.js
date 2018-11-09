const User = require('../models/users')

exports.getSignUp = function(req, res, next) {
    var message = req.flash('error')
    res.render('user/signup', { 
      title: 'project-pos',
      csrfToken: req.csrfToken(), 
      messages: message, 
      hasOneMessage: (message.length>0) ? true : false,
      sidebar_active: {signup: true}});
}

exports.signUp = (req, res, next) => {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl
      req.session.oldUrl = null
      return res.redirect(oldUrl)
    } else {
      return res.redirect('/')
    }
  }

exports.getSignIn = function(req, res, next) {
    var message = req.flash('error')
    res.render('user/signin', { title: 'project-pos',
    csrfToken: req.csrfToken(),
     messages: message,
      hasOneMessage: (message.length>0) ? true : false,
      sidebar_active: {login: true}
    });
  }

exports.signIn = (req, res, next) => {
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
   
  }

exports.getLogout = (req, res, next) => {
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
  }