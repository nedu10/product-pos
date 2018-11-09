const express = require('express')
const multer = require('multer')
const path = require('path')
const csrf = require('csurf')

const Middleware = require('../middlewares/middlewares')
const controller = require('../controllers/categoryController')

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

router.get('/', Middleware.isLoggedIn, Middleware.adminIsLoggedIn, controller.getAdminCategory)

router.get('/view', controller.getCategory)

router.get('/create',Middleware.isLoggedIn,  Middleware.adminIsLoggedIn, controller.getCreateCategory)

router.put('/update',categoryImage, Middleware.adminIsLoggedIn, (req,res,next) => {
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

router.get('/delete/:category_id/:category_title',Middleware.isLoggedIn, Middleware.adminIsLoggedIn, controller.deleteCategory)

router.post('/create',categoryImage, Middleware.isLoggedIn,  Middleware.adminIsLoggedIn, controller.createCategory)

module.exports = router