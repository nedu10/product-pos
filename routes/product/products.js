const express = require('express')
const multer = require('multer')
const path = require('path')
const csrf = require('csurf')


const csrfProtection = csrf()

const router = express.Router()


const Validation = require('../../middlewares/validations/inventory-middleware')
const middleware = require('../../middlewares/middlewares')
const controller = require('../../controllers/productController')

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

  

router.get('/create',middleware.isLoggedIn, middleware.adminIsLoggedIn, controller.getCreateProduct)

router.post('/create',middleware.adminIsLoggedIn, productImage, controller.createProduct)

router.get('/view', controller.getViewProduct)

router.get('/view/:category_id', controller.getViewSingleProduct)

router.get('/admin-view',middleware.isLoggedIn, middleware.adminIsLoggedIn, controller.getAdminViewProduct)

router.get('/admin-view/:category_id', middleware.isLoggedIn, middleware.adminIsLoggedIn, controller.getAdminViewSingleProduct)

router.put('/:product_id/update',middleware.isLoggedIn, middleware.adminIsLoggedIn, productImage, controller.updateProduct)

//add inventories
router.post('/inventory/create',middleware.adminIsLoggedIn, Validation.inventoryValidation, controller.createProductInventories)

router.get('/delete/:product_id/:product_title',middleware.isLoggedIn, middleware.adminIsLoggedIn, controller.deleteProduct)


module.exports = router