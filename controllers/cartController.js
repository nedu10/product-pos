const Product = require('../models/product/products')
const Cart = require('../models/cart/cart')


exports.getCart = (req, res, next) => {
    if (!req.session.cart) {
        return res.render('product/cart', {
            title: 'product-pos',
            cart: false,
            sidebar_active: {cart: true}
        })
    } else {
        return res.render('product/cart', {
            title: 'product-pos',
            cart: true,
            sidebar_active: {cart: true}
        })
    }
}

exports.addSingleCart = (req, res, next) => {
    var cart = new Cart((req.session.cart) ? req.session.cart : {})
    Product.findOne({_id: req.params.product_id})
    .populate('product_price_id category_id','product_discount product_price category_title category_description category_image')
    .exec()
    .then(response => {
        console.log('cart response >> ',response)
        cart.add(response, response._id)
        req.session.cart = cart
        req.session.cartArray = cart.generateArray()
        req.flash('success',`${response.product_title} Included to cart`)
        console.log("new cart>> ",req.session.cart)
        console.log("new cartArray >> ",req.session.cartArray)
        res.redirect('/product/view')

    })
    .catch(err => {
        console.log(err)
    })
}

exports.deleteSingleCart = (req, res, next) => {
    var cart = new Cart((req.session.cart) ? req.session.cart : {})
    cart.remove(req.params.product_id)
    console.log('finally',cart.generateArray())
    req.session.cart = (cart.generateArray().length === 0) ? null : cart  
    req.session.cartArray = (cart.generateArray().length === 0) ? null : cart.generateArray()
    console.log(req.session.cart)
    res.redirect('/cart')

    // Product.findOne({_id: req.params.product_id})
    // .populate('product_price_id category_id','product_discount product_price category_title category_description category_image')
    // .exec()
    // .then(response => {
    //     console.log('cart response >> ',response)
    //     cart.add(response, response._id)
    //     req.session.cart = cart
    //     req.session.cartArray = cart.generateArray()
    //     console.log("new cart >> ",req.session.cart)
    //     console.log("new cartArray >> ",req.session.cartArray)
    //     res.redirect('/product/view')

    // })
    // .catch(err => {
    //     console.log(err)
    // })
}