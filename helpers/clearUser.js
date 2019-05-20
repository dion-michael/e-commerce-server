const User = require('../models/User')
const Product = require('../models/Product')
const Cart = require('../models/Cart')

module.exports = function (done) {
    if (process.env.NODE_ENV === 'test') {
        let arrOfPromise = [
            User.deleteMany({}),
            Product.deleteMany({}),
            Cart.deleteMany({})
        ]

        Promise.all(arrOfPromise)
            .then(() => {
                done()
            }).catch(err => {
                console.log(err);
            })
    }
}