const router = require('express').Router()
const { authorization, authorizationAdmin } = require('../middleware/auth')
const { getCategoryRedis } = require('../middleware/redis')
const {
  getCategory,
  getCategoryId,
  postCategory,
  deleteCategory,
  getOrder,
  postOrder,
  getHistory,
  getCategoryIdName
} = require('../controler/category')

// params
router.get('/', authorizationAdmin, getCategoryRedis, getCategory)
router.get('/:id', authorizationAdmin, getCategoryId)
router.get('//:id', authorizationAdmin, getCategoryIdName)
router.post('/', authorizationAdmin, postCategory)
router.delete('/:id', authorizationAdmin, deleteCategory)
// order
router.get('/:order', authorization, getOrder)
router.post('/:order', authorization, postOrder)
router.get('/history', authorization, getHistory)
module.exports = router
