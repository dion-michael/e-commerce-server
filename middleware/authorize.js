const Product = require('../models/Product')

module.exports = (req, res, next) => {
    Product.findById(req.params.id)
        .then(found => {
            if (found) {
                if (req.loggedUser.id == found.seller) {
                    next()
                } else {
                    res.status(401).json({
                        msg: 'not authorized'
                    })
                }
            } else {
                res.status(404).json({
                    msg: 'product not found'
                })
            }
        }).catch(error => {
            res.status(500).json(error.errors)
        })
}