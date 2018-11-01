const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        rel: "user"
    },
    delivery_id: {
        type: String
    },
    date: {
        type: Number,
        default: Date.now()
    },
    status: {
        type: Boolean,
        default: false
    },
    totalQty: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    }
})

const OrderModel = mongoose.model('Orders', OrderSchema)

module.exports = OrderModel