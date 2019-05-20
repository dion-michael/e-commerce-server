const Product = require('../models/Product')
module.exports = (req, res, next) => {
    Product.findById(req.params.productId)
        .then(found => {
            if (found) {
                next()
            } else {
                res.status(404).json({
                    msg: 'product not found'
                })
            }
        })
        .catch(error => {
            res.status(500).json(error.errors)
        })
}