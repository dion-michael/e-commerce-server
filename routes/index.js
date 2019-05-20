const router = require('express').Router()
const userController = require('../controllers/userController')
const images = require('../helpers/images')
router.use('/cart', require('./cartRoutes.js'))
router.use('/products', require('./productRoutes.js'))
router.post('/register', userController.create)
router.post('/signin', userController.signIn)
router.post('/upload',
    images.multer.single('image'),
    images.sendUploadToGCS,
    (req, res) => {
        res.send({
            status: 200,
            message: 'Your file is successfully uploaded',
            link: req.file.cloudStoragePublicUrl
        })
    })

module.exports = router