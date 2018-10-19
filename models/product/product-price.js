const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productPriceSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        rel: "Product"
    },
    product_discount: {
        type: Number
    },
    product_price: {
        type: Number,
        required: [true, 'price is required']
    }
})

const productPriceModel = mongoose.model('ProductPrice', productPriceSchema)

module.exports = productPriceModel