const express = require('express')

const controller = require('../controllers/cartController')

const router = express.Router()

router.get('/', controller.getCart)

router.get('/:product_id', controller.addSingleCart)

router.get('/:product_id/delete', controller.deleteSingleCart)

module.exports = router