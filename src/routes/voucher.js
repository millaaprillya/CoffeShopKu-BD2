const router = require('express').Router()
const { authorization, authorizationAdmin } = require('../middleware/auth')
const {
  getVoucher,
  postVoucher,
  deleteVoucher,
  getVoucherByid
} = require('../controler/voucher')

// params
router.get('/', authorization, getVoucher)
router.post('/', authorizationAdmin, postVoucher)
router.get('/:id', authorizationAdmin, getVoucherByid)
router.delete('/:id', authorizationAdmin, deleteVoucher)

module.exports = router
