const chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect,
    app = require('../app'),
    clearProduct = require('../helpers/clearProduct'),
    clearUser = require('../helpers/clearUser')

chai.use(chaiHttp)

before(function (done) {
    clearUser(done)
})

after(function (done) {
    clearUser(done)
})

describe('\n====== API TESTS ======\n', function () {

    let productId = ''
    let token = ''
    let dummytoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvbmEiLCJpZCI6MTEsImlhdCI6MTU1NjUzMTE0N30.A37A7ZvPUX1NofZgQqlhVOTNFLg2wBLzm5tg2uVTRFM'
    let userId = ''

    console.log(productId, 'product id')
    console.log(token, 'token')
    console.log(userId, 'user id')

    describe('POST /register', function () {

        it('should return error email not valid', function (done) {
            const data = {
                username: "dion michael",
                email: "dionagoesgmail.com",
                password: "password12345"
            }
            chai
                .request(app)
                .post('/register')
                .send(data)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.property('email')
                    done()
                })
        })

        it('should return error no password', function (done) {
            const data = {
                name: "dion michael",
                email: "dionagoesgmail.com",
                password: ""
            }
            chai
                .request(app)
                .post('/register')
                .send(data)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.property('password')
                    done()
                })
        })

        it('should return error no email', function (done) {
            const data = {
                name: "dion michael",
                email: "",
                password: "12345"
            }
            chai
                .request(app)
                .post('/register')
                .send(data)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.property('email')
                    done()
                })
        })

        it('success should register a user', function (done) {
            const data = {
                username: "dion michael",
                email: "dionagoes@gmail.com",
                password: "password1234"
            }
            chai
                .request(app)
                .post('/register')
                .send(data)
                .then(success => {
                    expect(err).to.be.null
                    expect(success).to.have.status(201)
                    expect(success.body.username).to.equal(data.name)
                    expect(success.body.email).to.equal(data.email)
                    done()
                }).catch(error => {
                    done()
                })
        })
    })

    describe('POST /signin', function () {

        it('no email should return error', function (done) {
            const credential = {
                email: "",
                password: "12345"
            }
            chai
                .request(app)
                .post('/signin')
                .send(credential)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body).to.have.property('msg')
                    done()
                })
        })

        it('no password should return error', function (done) {
            const credential = {
                email: "dionagoes@gmail.com",
                password: ""
            }
            chai
                .request(app)
                .post('/signin')
                .send(credential)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body).to.have.property('msg')
                    done()
                })
        })

        it('invalid email should return an error', function (done) {
            const credential = {
                email: "dionagoesgmail.com",
                password: "12345"
            }
            chai
                .request(app)
                .post('/signin')
                .send(credential)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    done()
                })
        })

        it('wrong password should return an error', function (done) {
            const credential = {
                email: "dionagoes@gmail.com",
                password: "123445"
            }
            chai
                .request(app)
                .post('/signin')
                .send(credential)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body).to.have.property('msg')
                    done()
                })
        })

        it('success should return a token', function (done) {
            const credential = {
                email: "dionagoes@gmail.com",
                password: "password1234"
            }
            chai
                .request(app)
                .post('/signin')
                .send(credential)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property('token')
                    expect(res.body).to.have.property('username')
                    expect(res.body).to.have.property('email')
                    expect(res.body.email).to.equal(credential.email)
                    token = res.body.token
                    done()
                })
        })
    })

    describe('POST /products', function () {

        it('should require user to sign in', function (done) {
            const newProduct = {
                product_name: "Oneplus 5T",
                product_description: "Oneplus 5T 8GB RAM 128 Memory",
                price: 12345678
            }
            chai
                .request(app)
                .post('/products')
                .send(newProduct)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('msg')
                    done()
                })
        })

        it('should insert a product to database', function (done) {
            const newProduct = {
                product_name: "Oneplus 5T",
                product_description: "Oneplus 5T 8GB RAM 128 Memory",
                price: 12345678
            }
            chai
                .request(app)
                .post('/products')
                .set("token", token)
                .send(newProduct)
                .end(function (err, res) {
                    productId = res.body._id
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('product_name')
                    expect(res.body).to.have.property('product_description')
                    expect(res.body).to.have.property('price')
                    done()
                })
        })

        it('product name cannot be empty', function (done) {
            const newProduct = {
                product_name: "",
                product_description: "Oneplus 5T 8GB RAM 128 Memory",
                price: 12345678
            }
            chai
                .request(app)
                .post('/products')
                .set("token", token)
                .send(newProduct)
                .end(function (err, res) {
                    expect(res).to.have.status(500)
                    expect(res.body).to.have.property('product_name')
                    done()
                })
        })
        it('product description cannot be empty', function (done) {
            const newProduct = {
                product_name: "Oneplus 5T",
                product_description: "",
                price: 12345678
            }
            chai
                .request(app)
                .post('/products')
                .set("token", token)
                .send(newProduct)
                .end(function (err, res) {
                    expect(res).to.have.status(500)
                    expect(res.body).to.have.property('product_description')
                    done()
                })
        })
        it('price cannot be empty', function (done) {
            const newProduct = {
                product_name: "Oneplus 5T",
                product_description: "Oneplus 5T 8GB RAM 128 Memory",
                price: ""
            }
            chai
                .request(app)
                .post('/products')
                .set("token", token)
                .send(newProduct)
                .end(function (err, res) {
                    expect(res).to.have.status(500)
                    expect(res.body).to.have.property('price')
                    done()
                })
        })
        it('product name length must be at least 3', function (done) {
            const newProduct = {
                product_name: "On",
                product_description: "Oneplus 5T 8GB RAM 128 Memory",
                price: "10000000"
            }
            chai
                .request(app)
                .post('/products')
                .set("token", token)
                .send(newProduct)
                .end(function (err, res) {
                    expect(res).to.have.status(500)
                    expect(res.body).to.have.property('product_name')
                    done()
                })
        })
        it('product description length must be at least 6', function (done) {
            const newProduct = {
                product_name: "Oneplus 5T",
                product_description: "Onepl",
                price: "10000000"
            }
            chai
                .request(app)
                .post('/products')
                .set("token", token)
                .send(newProduct)
                .end(function (err, res) {
                    expect(res).to.have.status(500)
                    expect(res.body).to.have.property('product_description')
                    done()
                })
        })
        it('product price must be > 1', function (done) {
            const newProduct = {
                product_name: "Oneplus 5T",
                product_description: "Oneplus 5T 8GB RAM 128 Memory",
                price: "0"
            }
            chai
                .request(app)
                .post('/products')
                .set("token", token)
                .send(newProduct)
                .end(function (err, res) {
                    expect(res).to.have.status(500)
                    expect(res.body).to.have.property('price')
                    done()
                })
        })
    })

    describe('GET /products', function () {
        it('should send an array of products', function (done) {
            chai
                .request(app)
                .get('/products')
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    done()
                })
        })
        it('should return an object of requested product', function (done) {
            chai
                .request(app)
                .get('/products/' + productId)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('product_name')
                    expect(res.body).to.have.property('product_description')
                    expect(res.body).to.have.property('price')
                    done()
                })
        })
    })

    describe('PUT /products/:id', function () {
        it('should update the value of selected product', function (done) {
            const updateValue = {
                product_name: "Samsung S8",
                product_description: "Samsung S8 8GB RAM 128 Memory",
                price: 21349878
            }
            chai
                .request(app)
                .put('/products/' + productId)
                .set("token", token)
                .send(updateValue)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('product_name')
                    expect(res.body).to.have.property('product_description')
                    expect(res.body).to.have.property('price')
                    done()
                })
        })
    })

    describe('DELETE /products/:id', function () {
        it('should require user to sign in', function (done) {
            chai
                .request(app)
                .delete('/products/' + productId)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('msg')
                    done()
                })
        })

        it('should not authorize the delete', function (done) {
            chai
                .request(app)
                .delete('/products/' + productId)
                .set("token", dummytoken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.property('msg')
                    done()
                })
        })

        it('should delete selected product', function (done) {
            chai
                .request(app)
                .delete('/products/' + productId)
                .set("token", token)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('product_name')
                    expect(res.body).to.have.property('product_description')
                    expect(res.body).to.have.property('price')
                    done()
                })
        })


    })

    // describe('GET /users/:userid/cart', function () {
    //     it('should get users cart', function (done) {
    //         chai
    //             .request(app)
    //             .post(`/users/${userId}/product/${productId}`)
    //             .end(function (err, res) {
    //                 expect(err).to.be.null
    //                 expect(res).to.have.status(200)
    //                 expect(res.body.products).to.be.an('array')
    //                 done()
    //             })
    //     })
    // })

    // describe('POST /users/:userid/cart/:productId', function () {
    //     it('should put item into users cart', function (done) {
    //         chai
    //             .request(app)
    //             .post(`/users/${userId}/product/${productId}`)
    //             .end(function (err, res) {
    //                 expect(err).to.be.null
    //                 expect(res).to.have.status(200)
    //                 expect(res.body.products).to.include(productId)
    //                 done()
    //             })
    //     })
    // })

    // describe('DELETE users/:userId/cart/:productId', function () {
    //     it('should delete item from users cart', function (done) {
    //         chai
    //             .request(app)
    //             .delete(`/users/${userId}/product/${productId}`)
    //             .end(function (err, res) {
    //                 expect(err).to.be.null
    //                 expect(res).to.have.status(200)
    //                 expect(res.body.products).to.not.include(productId)
    //                 done()
    //             })
    //     })
    // })

})