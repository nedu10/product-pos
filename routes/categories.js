const express = require('express')
const multer = require('multer')
const path = require('path')
const csrf = require('csurf')

const Middleware = require('../middlewares/middlewares')

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

router.get('/create',  Middleware.isLoggedIn, (req, res, next) => {
    res.render('admin/category', {
        title: 'project-pos',
        csrfToken: req.csrfToken()
    })
})

router.post('/create',categoryImage,  Middleware.isLoggedIn, (req, res, next) => {
    console.log('add categoriy logs >> ',req.body)
})

module.exports = router