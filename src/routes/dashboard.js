const router = require('express').Router()
const { getTotalIncome } = require('../controler/dashboard')

router.get('/income', getTotalIncome)

module.exports = router
