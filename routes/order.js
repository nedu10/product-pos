const mongoose = require('mongoose')
const express = require('express')
const Middleware = require('../middlewares/middlewares')
const Order = require('../models/order/orders')
const OrderItem = require('../models/order/order-items')
const Product = require('../models/product/products')

const router = express.Router()

router.get('/checkout', Middleware.isLoggedIn, (req, res, next) => {
    if (req.session.buy) {
        return res.render('product/checkout', {
            title:  'product-pos'
        })
    }
    if (!req.session.cart) {
        return res.redirect('/cart')
    }
    console.log(req.user)
    res.render('product/checkout', {
        title:  'product-pos',
        sidebar_active: {}
    })
})

router.get('/view', Middleware.isLoggedIn, (req, res, next) => {
    Order.find({user_id: req.user[0]._id})
    .populate('user_id','first_name')
    .exec()
    .then(response => {
        console.log(response)
        console.log('user >> ',new Date(response[0].date))
        var orderItems = response
        var reverseOrderItems = orderItems.reverse()
        var newReverseOrderItems = []

        function checkLength(param) {
            if (param.toString().length == 1) {
                return `0${param}`
            }
            else {
                return param
            }
        }
        var ii = 0
        reverseOrderItems.forEach(function(element){
            ii++
            var eachItems = {
                s_n: ii,
                full_name: 'testing',
                phone_no: '09099998888',
                totalQty: element.totalQty,
                totalPrice: element.totalPrice,
                date: `${checkLength(new Date(element.date).getDate())} / ${checkLength(new Date(element.date).getMonth()+1)} / ${checkLength(new Date(element.date).getFullYear())}`,
                time: `${checkLength(new Date(element.date).getHours())} : ${checkLength(new Date(element.date).getMinutes())} : ${checkLength(new Date(element.date).getSeconds())}`,
                status: element.status
            }
            newReverseOrderItems.push(eachItems)
        })
        return res.render('order/order-view',{
            title: 'product-pos',
            order_items: newReverseOrderItems,
            sidebar_active: {orders: true}
        })
    })
    .catch(err => {
        console.log(err)
        return err
    })
})

router.get('/:product_id/buy', Middleware.isLoggedIn, (req, res, next) => {
    console.log(req.params.product_id)
    Product.findOne({_id: req.params.product_id})
    .populate('product_price_id category_id','product_discount product_price category_title category_description category_image')
    .exec()
    .then(response => {
        console.log('this is the  response',response)
        req.session.buy = response
        res.redirect('/order/checkout')
    })
    .catch(err => {
        console.log(err)
        return err
    })
})

router.post('/checkout', Middleware.isLoggedIn, (req, res, next) => {
    if (req.session.buy) {
        console.log('meeee2222 >> ',req.session.buy)
        const order = new Order({
            user_id: req.user[0]._id,
            date: Date.now(),
            totalQty: 1,
            totalPrice: req.session.buy.product_price_id.product_price
        })
        order.save()
        .then(responsei => {
            console.log(responsei)
            var orderItem = new OrderItem({
                order_id: responsei._id,
                product_id: req.session.buy._id,
                quantity: 1,
                total_price: req.session.buy.product_price_id.product_price
            })
            orderItem.save()
            .then(responsei2 => {
                console.log(responsei2)
                Product.findOne({_id: req.session.buy._id})
                .exec()
                .then(responsei3 => {
                    console.log(responsei3)
                    var product_in_stock_count = responsei3.product_in_stock_count-1
                    var product_item_sold = responsei3.product_item_sold+1
                    Product.update({_id: req.session.buy._id}, 
                        {$set: {product_in_stock_count: product_in_stock_count, product_item_sold: product_item_sold}})
                        .then(responsei4 => {
                            console.log(responsei4)
                            req.flash('success','successfully bought the product')
                            req.session.buy = null
                            return res.redirect('/product/view')
                        })
                        .catch(erri4 => {
                            console.log(erri4)
                            return erri4
                        })

                })
                .catch(erri3 => {
                    console.log(erri3)
                    return erri3
                })
            })
            .catch(erri2 => {
                console.log(erri2)
                return erri2
            })
        })
        .catch(erri => {
            console.log(erri)
            return erri
        })
    }
    else{
        if (!req.session.cart) {
            return res.redirect('/cart')
        }
        console.log(req.user[0])
        const order = new Order({
            user_id: req.user[0]._id,
            date: Date.now(),
            totalQty: req.session.cart.totalQty,
            totalPrice: req.session.cart.totalPrice
        })
        order.save()
        .then(response => {
            console.log(response)
            var cart_array = req.session.cartArray
            for (let i = 0; i < cart_array.length; i++) {
                var orderItem = new OrderItem({
                    order_id: response._id,
                    product_id: cart_array[i].item._id,
                    quantity: cart_array[i].itemQty,
                    total_price: cart_array[i].itemPrice
                })
                orderItem.save()
                .then(response2 => {
                    console.log(response2)
                    Product.findOne({_id: cart_array[i].item._id})
                    .exec()
                    .then(response3 => {
                        console.log('response3',response3)
                        var product_in_stock_count = response3.product_in_stock_count-cart_array[i].itemQty
                        var product_item_sold = response3.product_item_sold+cart_array[i].itemQty
                        Product.update({_id: cart_array[i].item._id}, 
                            {$set: {product_in_stock_count: product_in_stock_count, product_item_sold: product_item_sold}})
                            .then(response4 => {
                                console.log(response4)
                                if (i === (cart_array.length-1)){
                                    req.flash('success','successfully bought the product')
                                    req.session.cart = null
                                    res.redirect('/product/view')
                                }
                            })
                            .catch(err4 => {
                                console.log(err4)
                                return err4
                            })
                    })
                    .catch(err3 => {
                        console.log(err3)
                        return err3
                    })
                    // req.session.cart = null
                    // res.redirect('/product/view')
    
                })
                .catch(err2 => {
                    console.log(err2)
                    return err2
                })
            }
        })
        .catch(err => {
            console.log(err)
            throw err
        })
    }
    

})

// router.get('/', Middleware.isLoggedIn,  (req, res, next) => {
//     if (!req.session.cart) {
//         return res.redirect('/cart')
//     }
//     console.log(req.user[0])
//     const order = new Order({
//         user_id: req.user[0]._id
//     })
//     order.save()
//     .then(response => {
//         console.log(response)
//         var cart_array = req.session.cartArray
//         for (let i = 0; i < cart_array.length; i++) {
//             var orderItem = new OrderItem({
//                 order_id: response._id,
//                 product_id: cart_array[i].item._id,
//                 quantity: cart_array[i].itemQty,
//                 total_price: cart_array[i].itemPrice
//             })
//             orderItem.save()
//             .then(response2 => {
//                 console.log(response2)
//                 if (i === (cart_array.length-1)){
//                     res.redirect('/product/view')
//                 }
//             })
//             .catch(err2 => {
//                 console.log(err2)
//                 return err2
//             })
//         }
//     })
//     .catch(err => {
//         console.log(err)
//         throw err
//     })

// })

module.exports = router