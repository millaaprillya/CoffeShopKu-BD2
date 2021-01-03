const router = require('express').Router()
const { authorization, authorizationAdmin } = require('../middleware/auth')
const {
  getVoucher,
  getdata,
  getProduct,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
  postVoucher,
  deleteVoucher
} = require('../controler/product')
const {
  getProductByIdRedis,
  clearDataProductRedis,
  getProductRedis
} = require('../middleware/redis')
const uploadImage = require('../middleware/multer')

// product
router.get('/dashboard', getdata)
router.get('/', authorizationAdmin, getProductRedis, getProduct)
router.get('/:id', authorizationAdmin, getProductByIdRedis, getProductById)
router.post('/', authorizationAdmin, uploadImage, postProduct)
router.patch(
  '/:id',
  authorizationAdmin,
  clearDataProductRedis,
  uploadImage,
  patchProduct
)
router.delete('/:id', authorization, deleteProduct)

// voucher
router.get('/voucher/', getVoucher)
router.post('/:voucher', authorizationAdmin, postVoucher)
router.delete('/voucher/:id', authorizationAdmin, deleteVoucher)

module.exports = router
