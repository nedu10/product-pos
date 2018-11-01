
exports.inventoryValidation = function(req, res, next){
    console.log('neest >> ',req.body)
    if (!req.body.product) {
        return res.status(406).json({
            status: 'Failed',
            message: 'Product  is required'
        })
    }
    if (!req.body.date) {
        return res.status(406).json({
            status: 'Failed',
            message: 'Date is required'
        })
    }
    if (!req.body.number_of_product) {
        return res.status(406).json({
            status: 'Failed',
            message: 'Product quantity is required'
        })
    }
    next()
}