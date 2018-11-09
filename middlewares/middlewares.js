
exports.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        console.log(req.baseUrl, req.originalUrl)
        console.log(req.user)
        req.session.oldUrl = req.originalUrl
        res.redirect('/users/signin')
    }
}

exports.adminIsLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        console.log('admin user >> ',req.session.current_user)
        if (req.session.current_user.admin === 1) {
            next()
        }
        else {
            return res.render('error401', {title: 'project-pos'})
        }
    }
    else{
        console.log(req.baseUrl, req.originalUrl)
        console.log(req.user)
        req.session.oldUrl = req.originalUrl
        res.redirect('/users/signin')
    }
}

exports.userIsLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        console.log('normal user >> ',req.session.current_user)
        if (req.session.current_user.user === 1) {
            next()
        }
        else {
            return res.render('error401', {title: 'project-pos'})
        }
    }
    else{
        console.log(req.baseUrl, req.originalUrl)
        console.log(req.user)
        req.session.oldUrl = req.originalUrl
        res.redirect('/users/signin')
    }
}

exports.notLoggedIn =  function(req, res, next){
    if(!req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/dashboard')
    }
}