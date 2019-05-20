const cartController = require('../controllers/cartController')
const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const verifyProductIfExists = require('../middleware/verifyProductIfExists')

router.get('/', authenticate, cartController.getUserCart)
router.post('/:productId', authenticate, verifyProductIfExists, cartController.addItemToCart)
router.delete('/:productId', authenticate, cartController.deleteFromCart)

module.exports = router