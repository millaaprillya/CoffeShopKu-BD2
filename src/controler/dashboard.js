const { incomeHistory, getDataModelProduct } = require('../model/dashboard')
const helper = require('../helper/response')

module.exports = {
  getTotalIncome: async (request, response) => {
    try {
      const totalncome = await incomeHistory()
      const InComeToday = await getDataModelProduct()
      const Data = {
        inComeToday: InComeToday,
        totalAll: totalncome
      }
      return helper.response(response, 200, 'Dashboard', Data)
    } catch (error) {
      console.log(error)
      return helper.response(response, 404, 'Bad Request', error)
    }
  }
}
