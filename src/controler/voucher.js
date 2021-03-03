const {
  getVoucherModel,
  postVoucherModel,
  getVoucherByID,
  deleteVoucher
} = require('../model/voucher')
const helper = require('../helper/response')

module.exports = {
  getVoucher: async (request, response) => {
    try {
      const result = await getVoucherModel()
      return helper.response(response, 200, 'ok', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getVoucherByid: async (request, response) => {
    try {
      console.log(request.params)
      const { id } = request.params
      const result = await getVoucherByID(id)
      if (result === '') {
        return helper.response(
          response,
          404,
          'Bad Request',
          `Product ${id} is null`
        )
      }
      return helper.response(response, 200, 'ok', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  postVoucher: async (request, response) => {
    try {
      const {
        voucher_name,
        voucher_diskon,
        voucher_list,
        voucher_status
      } = request.body
      console.log(voucher_name)
      const setData = {
        voucher_name,
        voucher_diskon,
        voucher_list,
        voucher_created_at: new Date(),
        voucher_status
      }
      console.log(setData)
      const result = await postVoucherModel(setData)
      return helper.response(
        response,
        200,
        'Post voucher Product Succes :)',
        result
      )
    } catch (error) {
      return helper.response(response, 400, 'Failed to post :( ', error)
    }
  },
  deleteVoucher: async (request, response) => {
    try {
      const { id } = request.params
      const result = await deleteVoucher(id)
      return helper.response(response, 200, 'Delete  Succes ', result)
    } catch (error) {
      return helper.response(response, 400, ' Bad request', error)
    }
  }
}
