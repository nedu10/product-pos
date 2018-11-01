const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productCategorySchema = new Schema({
    category_title: {
        type: String,
        required: [true, 'category title is required']
    },
    category_description: {
        type: String,
        required: [true, 'description is required']
    },
    category_image: {
        type: Object,
        required: [true, 'image is required for this category']
    }
})

const productCategoryModel = mongoose.model('ProductCategory', productCategorySchema)

module.exports = productCategoryModel