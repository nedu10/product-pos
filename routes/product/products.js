const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const csrf = require('csurf')


const csrfProtection = csrf()

const router = express.Router()

// router.use(csrfProtection)

const productPrice = require('../../models/product/product-price')
const Product = require('../../models/product/products')
const ProductCategory = require('../../models/product/product-categories')
const ProductInventory = require('../../models/product/inventory')
const Validation = require('../../middlewares/validations/inventory-middleware')

function testMiddleware(req, res, next){
    console.log('testmiddleware >> ',req.body)
    next()
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploaded-images/product-images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})

const productImage = multer({
    storage: storage
}).single('product_image')


router.use(testMiddleware)

router.use(csrfProtection)


function testMiddleware(req, res, next){
    console.log('testmiddleware >> ',req.body ,'query>> ',req.query)
    next()
  }
  router.use(testMiddleware)
  

router.get('/create', (req, res, next) => {
    ProductCategory.find()
    .select('_id category_title')
    .exec()
    .then(response => {
        var check = false
        
        
        var product_err = req.body

        console.log('Errr >> ', product_err);
        // console.log(req.query.error)
        // if(req.query.error){
        //     if (req.query.error.length > 0) {
        //         check = true
        //         var product_err = req.query.error.split(',')
        //         console.log(product_err)
        //     }
        // }
        // req.query.error = null
        // console.log(req.query.error)
        res.render('product/create-product', {
            title: 'product-pos',
            product_category: response,
            product_error: (check) ? product_err : false,
            csrfToken: req.csrfToken()
        })
    })
    .catch(err => {
        throw err
    })
})

router.post('/create', productImage,  (req, res, next) => {
    var productError = []
    if (!req.body.product_description || !req.body.product_name  || !req.body.product_price) {
        if (!req.body.product_name) {
            productError.push('product name is required')
        }
        if (!req.body.product_description) {
            productError.push('product description is required')
        }
        if (!req.body.product_price) {
            productError.push('product price is required')
        }
        console.log('product-image >> ', req.file)
    
        req.body.errorMessage = productError
        console.log('mmerr>>>', req.body)
        return res.redirect('/product/create')
    }
     const newProduct = new Product({
         product_title: req.body.product_name,
         product_short_description: req.body.product_short_description,
         product_description: req.body.product_description,
         category_id: req.body.product_category,
         product_in_stock_count: req.body.number_of_item,
         product_image: {
            image_name: req.file.originalname,
            image_path: 'uploaded-images/product-images/'+req.file.filename  
         }
     })
     newProduct.save()
     .then(response => {
         console.log('response1 >> ', req.body)
         const newProductPrice = new productPrice({
             product_id: response._id,
             product_discount: (req.body.product_discount) ? req.body.product_discount : 0,
             product_price: req.body.product_price
         })
         newProductPrice.save()
         .then( response2 => {
             console.log('response2 >> ',response)
            Product.update({_id: response._id},{$set: {product_price_id: response2._id}})
            .exec()
            .then( response3 => {
                console.log(response3)
                res.redirect('/product/view')
            })
            .catch(err => {
                throw err
            })
         })
         .catch(err => {
             return err
         })
     })
     .catch( err => {
         console.log('nn >> ',err)
         return error
     })
})

router.get('/view', (req, res, next) => {
    Product.find()
    .populate('product_price_id category_id','product_discount product_price category_title category_description category_image')
    .exec()
    .then(response => {
        // console.log(response)
        product_list = response
        response.reverse()
        var successMsg = req.flash('success')[0]
        res.render('product/view-product', {title: 'product-pos', 
        product_list: response, 
        csrfToken: req.csrfToken(), 
        check_add_inventory: true,
        success_msg: successMsg
    })
        
    })
    .catch(err => {
        console.log(err)
        return err
    })
})

//add inventories
router.post('/inventory/create',Validation.inventoryValidation, (req, res, next) => {
    console.log('dfgchjdhgxchjnsljx')
   const newProductInventory = new ProductInventory({
       product_id: req.body.product,
       new_stock_added: req.body.number_of_product,
       date: req.body.Date
   })

   newProductInventory.save()
   .then(response => {
       Product.findOne({_id: req.body.product})
       .then( response2 => {
           console.log(response2)
           const new_product_in_stock_count =Number(response2.product_in_stock_count) + Number(req.body.number_of_product)
           Product.update({_id: req.body.product}, {$set : {product_in_stock_count: new_product_in_stock_count}})
           .then(response3 => {
                console.log(response3);
                res.status(202).json({
                    status: 'success',
                    message: 'successfully created inventory'
                })
           })
           .catch(error3 => {
                console.log(error3)
                res.status(500).json({
                status: 'Failed',
                message: 'internal server error'
                })
           })
       })
       .catch(error2 => {
           console.log(error2)
           res.status(406).json({
            status: 'Failed',
            message: 'Product Does not exist'
            })
       })
       
   })
   .catch(error => {
        console.log(error)
        return error
    })

})


module.exports = router