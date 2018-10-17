const passport = require('passport')
const localStrategy = require('passport-local')

const User = require('../models/users')

//indicates that the user should be sserialize by id when stored in the session
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.find({_id: id}, function(err, user){
        done(err, user)
    })
})

passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password1',
    passReqToCallback: true
}, (req, email, password1, done) => {
    if(password1 == "" || req.body.password2 == ""){
        return done(null, false, {message: 'Password field cannot be empty'})
    }
    if(password1 !== req.body.password2){
        return done(null, false, {message: 'Password mismatch'})
    }
    User.findOne({email: email}, function(err, user){
        if(err){
            return done(err)
        }
        if(user){
            return done(null, false, {message: 'Email already in use'})
            
        }
        const newUser = new User()
        newUser.first_name = req.body.first_name,
        newUser.last_name = req.body.last_name,
        newUser.email = email,
        newUser.password = newUser.encryptPassword(password1)
        newUser.save()
        .then(user => {
            done(null, user)
        })
        .catch(err => {
            done(err)
        })
    })
}))

//sigin configs
passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password1',
    passReqToCallback: true
}, (req, email, password1, done) => {
    console.log(req.body)
    User.findOne({email: email}, function(err, user){
        if(err){
            return done(err)
        }
        if(!user){
            return done(null, false, {message: 'Account does not exist'})
            
        }
        console.log('am here')
        if(!user.validatePassword(password1)){
            return done(null, false, {message: 'Password and email do not correspond'})
        }
        done(null, user)
    })
}))