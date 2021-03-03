const router = require('express').Router()
const { getdetailOrder, postDataOrder } = require('../controler/detailOrder')

router.get('/', getdetailOrder)
router.post('/', postDataOrder)
// router.delete('/:id', deleteOrder)

module.exports = router
