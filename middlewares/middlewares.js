
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

exports.notLoggedIn =  function(req, res, next){
    if(!req.isAuthenticated()){
        next()
    }
    else{s
        res.redirect('/users/signup')
    }
}