
exports.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/')
    }
}

exports.notLoggedIn =  function(req, res, next){
    if(!req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/')
    }
}