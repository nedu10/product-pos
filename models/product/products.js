const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    product_name: {
        type: String,
        required: [true, 'product name is required']
    },
    product_description: {
        type: String,
        required: [true, 'product description is required']
    },
    product_price: {
        type: String,
        required: [true, 'product price is required']
    },
    product_image: {
        type: Object,
        required: [true, 'image is required for this product']
    }
})

const productModel = mongoose.model('Product', productSchema)

module.exports = productModel