const mongoose = require('mongoose')
const DB_PATH = process.env.DB_PATH + "_" + process.env.NODE_ENV
mongoose.connect(DB_PATH, {useNewUrlParser: true})
mongoose.set('useFindAndModify', false)

const Schema = mongoose.Schema
const cartSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    products: [{type: Schema.Types.ObjectId, ref: "Product"}]
})
const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart