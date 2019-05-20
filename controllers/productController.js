const Product = require("../models/Product")

class productController {

    static async readAll(req, res) {
        try {
            let products = await Product.find({}).sort({
                createdAt: -1
            })
            res.json(products)
        } catch (error) {
            res.status(500).json(error.errors)
        }
    }

    static async readOne(req, res) {
        try {
            let product = await Product.findById(req.params.id)
            res.json(product)
        } catch (error) {
            res.status(500).json(error.errors)
        }
    }

    static async create(req, res) {
        try {
            let product = new Product({
                product_name: req.body.product_name,
                product_description: req.body.product_description,
                price: req.body.price,
                seller: req.loggedUser.id,
                stock: req.body.stock,
                image: req.body.image,
                createdAt: new Date()
            })
            let result = await product.save()
            res.json(result)
        } catch (error) {
            res.status(500).json(error.errors)
        }
    }

    static async update(req, res) {
        try {
            let product = await Product.findOneAndUpdate(req.params.id, {
                $set: {
                    product_name: req.body.product_name,
                    product_description: req.body.product_description,
                    price: req.body.price,
                    seller: req.loggedUser.id,
                    stock: req.body.stock,
                    image: req.body.image,
                    updatedAt: new Date()
                }
            })
            res.json(product)
        } catch (error) {
            res.status(500).json(error.errors)
        }
    }

    static async delete(req, res) {
        try {
            let product = await Product.findByIdAndDelete(req.params.id)
            res.json(product)
        } catch (error) {
            res.status(500).json(error.errors)
        }
    }

    static decrementStock(req, res) {
        console.log(req.params.productId);
        Product.findById(req.params.id)
            .then(found => {
                console.log(found);
                found.stock -= 1
                return found.save()
            }).then((success) => {
                res.json(success)
            }).catch(error => {
                res.status(500).json(error.errors)
            })
    }

}

module.exports = productController