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
console.log(csrfProtection.csrf);

function testMiddleware(req, res, next){
    console.log('testmiddleware >> ',req.body)
    next()
}
router.use(testMiddleware)

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

router.use(csrfProtection)

router.get('/create',(req, res, next) => {
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

        const testCsrf = req.csrfToken()
        console.log('csrf >> ',testCsrf)
        res.render('product/create-product', {
            title: 'product-pos',
            product_category: response,
            product_error: (check) ? product_err : false,
            csrfToken: testCsrf
        })
    })
    .catch(err => {
        throw err
    })
})

router.post('/create', (req, res, next) => {
    var productError = []
    console.log('csrfpost >> ',req.body)
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
         category_id: req.body.product_category._id,
         product_image: {
            image_name: req.file.originalname,
            image_path: 'uploaded-images/product-images/'+req.file.filename  
         }
     })
     newProduct.save()
     .then(response => {
         console.log(response)
         res.render('index')
     })
     .catch( err => {
         consolpe.log('nn >> ',err)
     })
})


module.exports = router