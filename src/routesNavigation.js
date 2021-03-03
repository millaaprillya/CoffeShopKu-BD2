const router = require('Express').Router()

const order = require('./routes/order')
router.use('/order', order)

const dashboard = require('./routes/dashboard')
router.use('/dashboard', dashboard)

const product = require('./routes/product')
router.use('/product', product)

const category = require('./routes/category')
router.use('/category', category)

const voucher = require('./routes/voucher')
router.use('/voucher', voucher)

const user = require('./routes/user')
router.use('/user', user)

module.exports = router
