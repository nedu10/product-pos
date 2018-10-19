const mongoose = require('mongoose')
const  ProductCategory = require('../models/product/product-categories')

//setting up DB
dbURL = 'mongodb://127.0.0.1:27017/shopping-cart'  //locally installed mongodb

mongoose.connect(dbURL, {useNewUrlParser: true})
mongoose.Promise = global.Promise;



const product_category = new ProductCategory({
    category_title: 'shoe',
    category_description: 'shoe at affordable prices',
    category_image: {
        img_name: "shoe",
        img_src: "images/shoe.jpg"
    }
})

// const Middlewares = require('../middlewares/middlewares')

// console.log(Middlewares.chinedu)

console.log('mmm')
product_category.save()
.then(res => {
    console.log(res)
})
.catch( err => {
    console.log(err)
})