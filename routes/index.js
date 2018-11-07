var express = require('express');
const Product = require('../models/product/products')
const productCategory = require('../models/product/product-categories')
const Order = require('../models/order/orders')
const Users = require('../models/users')
const Middleware = require('../middlewares/middlewares')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'project-pos', sidebar_active: {index: true} });
});

router.get('/dashboard', Middleware.isLoggedIn, function(req, res, next) {
  res.render('dashboard', { title: 'project-pos', sidebar_active: {dashboard: true} });
});



module.exports = router;
