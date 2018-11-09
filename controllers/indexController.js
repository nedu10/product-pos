const Product = require('../models/product/products')
const productCategory = require('../models/product/product-categories')
const Order = require('../models/order/orders')
const Users = require('../models/users')

exports.getSlash = function(req, res, next) {
    console.log(req.session.current_user)
    if (req.session.current_user) {
        if (req.session.current_user.admin) {
            return res.redirect('/dashboard')
        }
        else {
            return res.redirect('/product/view')
        }
    }
    else {
        return res.redirect('/product/view')
    }
    // res.render('index', { title: 'project-pos', sidebar_active: {index: true} });
}

exports.dashboard = function(req, res, next) {
    Users.find()
    .exec()
    .then(response => {
      const user = response.length
      productCategory.find()
      .exec()
      .then(response1 => {
        const category = response1.length
        Product.find()
        .exec()
        .then(response2 => {
          const product = response2.length
          Order.find()
          .exec()
          .then(response3 => {
            const orders = response3.length
            Order.find({status: true})
            .exec()
            .then(response4 => {
              const deliveredOrders = response4.length
              res.render('dashboard', { 
                title: 'project-pos', 
                dashboard: {
                  users: user,
                  categories: category,
                  products: product,
                  orders: orders,
                  delivered_orders: deliveredOrders,
                  pending_orders: orders - deliveredOrders
                },
                sidebar_active: {dashboard: true} 
              });
            })
            .catch(err4 => {
              console.log(err4)
              throw err4
            })
          })
          .catch(err3 => {
            console.log(err3)
            throw err3
          })
        })
        .catch(err2 => {
          console.log(err2)
          throw err2
        })
      })
      .catch(err1 => {
        console.log(err1)
        throw err1
      })
    })
    .catch(err => {
      console.log(err)
      throw err
    })
  
  }
