const express = require('express')
const multer = require('multer')
const path = require('path')
const csrf = require('csurf')

const Middleware = require('../middlewares/middlewares')
const Category = require('../models/product/product-categories')
const Product = require('../models/product/products')

const csrfProtection = csrf()

//Initializing Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploaded-images/category-images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})

const categoryImage = multer({
    storage: storage
}).single('category_image')

const router = express.Router()

router.use(csrfProtection)

router.get('/', Middleware.isLoggedIn, (req, res, next) => {
    Category.find({})
    .exec()
    .then(response => {
        console.log(response)
        var successMsg = req.flash('success')[0]
        const category_list = response
        return res.render('admin/category/view-category', {
            title: 'project-pos',
            category_list: category_list.reverse(),
            csrfToken: req.csrfToken(),
            success_msg: successMsg,
            sidebar_active: {categories: true}
        })
    })
    .catch(err => {
        console.log(err)
        throw err
    })
    
})

router.get('/create',  Middleware.isLoggedIn, (req, res, next) => {
    res.render('admin/category/create-category', {
        title: 'project-pos',
        csrfToken: req.csrfToken(),
        sidebar_active: {categories: true}
    })
})

router.put('/update',categoryImage, Middleware.isLoggedIn, (req,res,next) => {
    console.log(req.headers, req.body, req.file)
    if (!req.file) {
        Category.update({_id: req.body.category_id}, {$set: 
            {
                category_title: req.body.category_title,
                category_description: req.body.category_description
            }
        })
        .then(response => {
            console.log(response)
            req.flash('success', 'Category successfully Updated')
            res.status(202).json({
                status: 'Success',
                message: response
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                status: 'Failed',
                message: err
            })
        })
    }
    else {
        Category.update({_id: req.body.category_id}, {$set: 
            {
                category_title: req.body.category_title,
                category_description: req.body.category_description,
                category_image: {
                    image_name: req.file.originalname,
                    image_path: 'uploaded-images/category-images/'+req.file.filename
                }
            }
        })
        .then(response => {
            console.log(response)
            req.flash('success', 'Category successfully Updated')
            res.status(202).json({
                status: 'Success',
                message: response
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                status: 'Failed',
                message: err
            })
        })
    }  
})

router.get('/delete/:category_id/:category_title', (req, res, next) => {
    console.log(req.params.category_id)
    Product.find({category_id: req.params.category_id})
    .exec()
    .then(response1 => {
        console.log(response1)
        if (response1.length  ==  0){
            Category.remove({_id: req.params.category_id})
            .then(response => {
                console.log(response)
                req.flash('success', `${req.params.category_title} Deleted Successfully`)
                res.redirect('/category')
            })
            .catch(err => {
                console.log(err)
                throw err
            })
        } else {
            for (let i = 0; i < response1.length; i++) {
                Product.remove({_id: response1[i]._id})
                .exec()
                .then(response2 => {
                    console.log(response2)
                    if (i == (response1.length - 1)) {
                        Category.remove({_id: req.params.category_id})
                        .then(response => {
                            console.log(response)
                            req.flash('success', `${req.params.category_title} Deleted Successfully`)
                            res.redirect('/category')
                        })
                        .catch(err => {
                            console.log(err)
                            throw err
                        })
                    }
                })
                .catch(err2 => {
                    console.log(err2)
                    throw err2
                })
                
            }
        }
    })
    .catch(err1 => {
        console.log(err1)
        throw err1
    })
    
})

router.post('/create',categoryImage,  Middleware.isLoggedIn, (req, res, next) => {
    console.log('add categoriy logs >> ',req.body)
    console.log('files: ', req.file)
    var categoryError = []
    if (!req.body.category_description || !req.body.category_name  || !req.file) {
        if (!req.body.category_name) {
            categoryError.push('Category name is required')
        }
        if (!req.body.category_description) {
            categoryError.push('Category description is required')
        }
        if (!req.file) {
            categoryError.push('Category image is required')
        }
    
        req.body.errorMessage = categoryError
        return res.redirect('/category/create')
    }
    const newCategory = new Category({
        category_title: req.body.category_name,
        category_description: req.body.category_description,
        category_image: {
           image_name: req.file.originalname,
           image_path: 'uploaded-images/category-images/'+req.file.filename  
        }
    })
    newCategory.save()
    .then(response => {
        console.log(response)
        return res.redirect("/category")
    })
    .catch(err => {
        console.log(err)
        return err
    })
})

module.exports = router