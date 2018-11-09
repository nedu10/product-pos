const express = require('express')

const Middleware = require('../middlewares/middlewares')
const controller = require('../controllers/orderController')

const router = express.Router()

router.get('/checkout', Middleware.isLoggedIn, Middleware.userIsLoggedIn, controller.getCheckout)

router.get('/admin-view', Middleware.isLoggedIn, Middleware.adminIsLoggedIn, controller.adminOrderView)

router.get('/admin-view/:order_id/accept',Middleware.isLoggedIn, Middleware.adminIsLoggedIn, controller.adminAcceptOrder)

router.get('/admin-view/:order_id/remove',Middleware.isLoggedIn, Middleware.adminIsLoggedIn, controller.adminRemoveOrder)

router.get('/admin-view/:order_id/delete',Middleware.isLoggedIn, Middleware.adminIsLoggedIn, controller.adminDeleteOrder)

router.get('/view',Middleware.isLoggedIn, Middleware.userIsLoggedIn, controller.orderView)

router.get('/:product_id/buy', Middleware.isLoggedIn, Middleware.userIsLoggedIn, controller.buyOrder)

router.post('/checkout', Middleware.isLoggedIn, Middleware.userIsLoggedIn, controller.orderCheckout)

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