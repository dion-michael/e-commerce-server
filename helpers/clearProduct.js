const Product = require('../models/Product')

module.exports = function (done) {
    if (process.env.NODE_ENV === 'test') {
        Product
            .deleteMany({})
            .then(function () {
                done();
            })
            .catch(function (err) {
                console.log(err)
            })
    }
}