const productController = require('../controllers/productController')
const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.post('/', authenticate, productController.create)
router.get('/', productController.readAll)
router.get('/:id', productController.readOne)
router.put('/:id', authenticate, authorize, productController.update)
router.delete('/:id', authenticate, authorize, productController.delete)
router.patch('/:id', productController.decrementStock)

module.exports = router