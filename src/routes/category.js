const router = require('express').Router()
const { authorizationAdmin, authorization } = require('../middleware/auth')
const { getCategoryRedis } = require('../middleware/redis')
const {
  getProductBycategory,
  getCategoryId,
  postCategory,
  deleteCategory,
  getCategoryIdName
} = require('../controler/category')

router.get('/', authorization, getProductBycategory)
router.get('/:id', authorizationAdmin, getCategoryId)
router.get('//:id', authorizationAdmin, getCategoryIdName)
router.post('/', authorizationAdmin, postCategory)
router.delete('/:id', authorizationAdmin, deleteCategory)

module.exports = router
