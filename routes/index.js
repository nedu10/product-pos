var express = require('express');

const Middleware = require('../middlewares/middlewares')
const controller = require('../controllers/indexController')

var router = express.Router();

/* GET home page. */
router.get('/', controller.getSlash);

router.get('/dashboard',Middleware.isLoggedIn, Middleware.adminIsLoggedIn, controller.dashboard);

module.exports = router;
