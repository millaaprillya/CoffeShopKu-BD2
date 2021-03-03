const router = require('express').Router()
const { authorization, authorizationAdmin } = require('../middleware/auth')
const {
  getProduct,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct
} = require('../controler/product')
const { getProductByIdRedis, getProductRedis } = require('../middleware/redis')
const uploadImage = require('../middleware/multer')

// product
router.get('/', authorization, getProduct)
router.get('/:id', authorization, getProductByIdRedis, getProductById)
router.post('/', authorizationAdmin, uploadImage, postProduct)
router.patch('/:id', authorizationAdmin, uploadImage, patchProduct)
router.delete('/:id', authorization, deleteProduct)

module.exports = router
