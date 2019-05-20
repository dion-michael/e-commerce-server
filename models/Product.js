const mongoose = require('mongoose')
const DB_PATH = "mongodb://localhost/ecommerce_" + process.env.NODE_ENV
mongoose.connect(DB_PATH, {
    useNewUrlParser: true
})
mongoose.set('useFindAndModify', false)

const Schema = mongoose.Schema
const productSchema = new Schema({
    product_name: {
        type: String,
        required: [true, "cannot be empty"],
        minlength: [3, "must be >= 3 characters long"]
    },
    product_description: {
        type: String,
        required: [true, "cannot be empty"],
        minlength: [6, "must be > 6 characters long"]
    },
    price: {
        type: Number,
        required: [true, "cannot be empty"],
        min: [1, "must be >= 1"]
    },
    rating: Number,
    image: String,
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: Date,
    stock: Number,
})
const Product = mongoose.model('Product', productSchema)

module.exports = Product