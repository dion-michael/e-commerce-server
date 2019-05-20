const Cart = require("../models/Cart")

class cartController {

    static addItemToCart(req, res) {
        console.log(req.loggedUser.cartId);
        Cart.findById(req.loggedUser.cartId)
            .then(found => {
                if (found) {
                    found.products.push(req.params.productId)
                    return found.save()
                } else {
                    res.status(404).json({
                        msg: "cart not found"
                    })
                }
            })
            .then(savedCart => {
                res.status(200).json(savedCart)
            })
            .catch(err => {
                res.status(500).json(err.errors)
            })
    }

    static getUserCart(req, res) {
        Cart.findById(req.loggedUser.cartId)
            .populate({
                path: 'products',
                populate: {
                    path: 'seller',
                    model: 'User'
                }
            })
            .then(found => {
                if (found) {
                    res.json(found)
                } else {
                    res.status(404).json({
                        msg: "cart not found"
                    })
                }
            }).catch(error => {
                res.status(500).json(error.errors)
            })
    }

    static deleteFromCart(req, res) {
        Cart.findById(req.loggedUser.cartId)
            .then(found => {
                console.log(found.products.indexOf(req.params.productId));
                let index = found.products.indexOf(req.params.productId)
                if (index !== -1) {
                    found.products.splice(found.products.indexOf(req.params.productId), 1)
                    return found.save()
                } else {
                    res.status(404).json({
                        msg: "product not found"
                    })
                }
            }).then(saved => {
                res.status(200).json(saved)
            }).catch(error => {
                console.log(error.errors);
            })
    }


}

module.exports = cartController