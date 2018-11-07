var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var expressHbs = require('express-handlebars')
var passport = require('passport')
var flash = require('connect-flash')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var product = require('./routes/product/products');
var cart = require('./routes/cart');
var order = require('./routes/order');
var category = require('./routes/categories');

var CategoryModel = require('./models/product/product-categories')
var UserTypeModel = require('./models/user-type')

var app = express();

//setting up DB
dbURL = 'mongodb://127.0.0.1:27017/shopping-cart'  //locally installed mongodb

mongoose.connect(dbURL, {useNewUrlParser: true})
mongoose.Promise = global.Promise;

require('./configs/passport')

var hbs = expressHbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
      counter: function (index) { return index++; }
  }
});

//handlebars 
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'projectpossupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new mongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 240*60*1000}
}))



//body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//flash middleware is used to append validation message to sessions
app.use(flash())
//initializing passport middleware
app.use(passport.initialize())
//this tells passport to use session for authentiication
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  // req.session.current_user = req.user
  res.locals.logged_in = req.isAuthenticated()
  res.locals.not_logged_in = !req.isAuthenticated()
  res.locals.session = req.session
console.log( 'hugyftredfgiukjhgfsxcvbyjrtezdxctygt67k');

  if (!req.user) {
    res.locals.session.current_user = null
    CategoryModel.find()
      .select('category_title')
      .exec()
      .then(response => {
        console.log(response)
        res.locals.sidebar_category = response
        next()
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  } else {
    UserTypeModel.findOne({_id: req.user[0].user_type_id})
    .select('name')
    .exec()
    .then(response1 => {
      console.log('response1 >> ', response1);
      var newUser = {data: req.user[0], admin: (response1.name.toLowerCase() == "user") ? 0 : 1  ,user: (response1.name.toLowerCase() == "user") ? 1 : 0  }
      res.locals.session.current_user = newUser 
      console.log('MMMeee >> ', newUser)
      CategoryModel.find()
      .select('category_title')
      .exec()
      .then(response => {
        console.log(response)
        res.locals.sidebar_category = response
        next()
      })
      .catch(err => {
        console.log(err)
        throw err
      })
      
    })
    .catch(err => {
      console.log(err)
      return err
    })
  }



})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', product);
app.use('/cart', cart)
app.use('/order', order)
app.use('/category', category)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
