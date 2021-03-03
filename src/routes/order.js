const router = require('express').Router()
const { authorization } = require('../middleware/auth')
const { getCategoryRedis } = require('../middleware/redis')
const { postOrder, getHistory } = require('../controler/history')

router.get('/history/:id', authorization, getCategoryRedis, getHistory)
router.post('/:id', authorization, postOrder)
module.exports = router
