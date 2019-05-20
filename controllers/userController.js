const User = require("../models/User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Cart = require('../models/Cart')

class userController {

    static getAll(req, res) {
        res.status(200).json({
            msg: 'masuk'
        })
    }

    static async create(req, res) {
        try {
            let cart = await Cart.create({
                products: []
            })
            try {
                let user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    cartId: cart.id
                })
                let save = await user.save()
                res.status(201).json(save)
            } catch (error) {
                await Cart.findByIdAndDelete(cart.id)
                res.status(401).json(error.errors)
            }
        } catch (error) {
            res.status(500).json(error.errors)
        }
    }

    static signIn(req, res) {
        User.findOne({
            email: req.body.email
        }).then(found => {
            if (found) {
                console.log(found._id);
                let isPasswordValid = bcrypt.compareSync(req.body.password, found.password)
                if (isPasswordValid) {
                    let token = jwt.sign({
                        username: found.username,
                        id: found._id,
                        cartId: found.cartId
                    }, process.env.JWT_SECRET)
                    res.status(200).json({
                        msg: "logged in",
                        username: found.username,
                        email: found.email,
                        cartId: found.cartId,
                        userId: found.id,
                        token
                    })
                } else {
                    res.status(404).json({
                        msg: "wrong password/username"
                    })
                }
            } else {
                res.status(404).json({
                    msg: "wrong password/username"
                })
            }
        }).catch(error => {
            res.status(500).json(error.errors)
        })
    }
}

module.exports = userController