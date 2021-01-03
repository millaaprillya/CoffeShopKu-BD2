const { getDataModel, getDataModelProduct } = require('../model/dashboard')
const helper = require('../helper/response')

module.exports = {
  getData: async (request, response) => {
    try {
      const result = await getDataModel
      const result2 = await getDataModelProduct
      return helper.response(
        response,
        200,
        'get Data history suscces full',
        result,
        result2
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
