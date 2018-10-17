const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const Product = require('../../models/product/products')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('destination')
        cb(null, './public/uploaded-images/product-images')
    },
    filename: (req, file, cb) => {
        console.log('filename')
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})

const productImage = multer({
    storage: storage
}).single('product_image')

const router = express.Router()

router.get('/create', (req, res, next) => {
    res.render('product/create-product', {title: 'product-pos'})
})

router.post('/create', productImage, (req, res, next) => {
    var productError = []
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
    console.log('req >> ', req.body)
    console.log('product-error >> ',productError)
    res.render('product/create-product', {title: 'product-pos'})
})

module.exports = router