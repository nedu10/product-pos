const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    product_title: {
        type: String,
        required: [true, 'product title is required']
    },
    product_short_description: {
        type: String,
        required: [true, 'short description is required']
    },
    product_description: {
        type: String,
        required: [true, 'description is required']
    },
    product_price_id: {
        type: mongoose.Schema.Types.ObjectId,
        rel: "ProductPrice"
    },
    product_image: {
        type: Object,
        required: [true, 'image is required for this product']
    },
    special_tag : {
        type: Object,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        rel: "ProductCategory"
    } ,
    product_in_stock_count: {
        type: Number,
        default: 0
    },
    product_item_sold : {
        type: Number,
        default: 0
    }
})

const productModel = mongoose.model('Product', productSchema)

module.exports = productModel