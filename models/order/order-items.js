const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderItemsSchema = new Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        rel: "Order"
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        rel: 'Product'
    },
    quantity: {
        type: Number,
        default: 1
    },
    total_price: {
        type: Number,
        default: 0
    }
})

const OrderItemsModel = mongoose.model('OrderItem', OrderItemsSchema)

module.exports = OrderItemsModel