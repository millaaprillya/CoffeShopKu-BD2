const { getProductByIdModel } = require('../model/product')
const { postDataOrderModel } = require('../model/detailOrder')
const {
  patchHistoryModel,
  postHistoryModel,
  getHistoryModelById,
  getHistoryById,
  incomeHistory
} = require('../model/history')
const helper = require('../helper/response')
const { getUserByIdModel } = require('../model/user')
module.exports = {
  getHistory: async (request, response) => {
    try {
      const { id } = request.params
      const userId = await getUserByIdModel(id)
      if (userId.length === 0) {
        return helper.response(response, 404, `user is empty ${id}`)
      } else {
        let result = await getHistoryModelById(id)
        for (let i = 0; i < result.length; i++) {
          result[i].orders = await getHistoryById(result[i].history_id)
        }

        return helper.response(
          response,
          200,
          'Get Data history suscces full',
          result
        )
      }
    } catch (error) {
      console.log(error.response)
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  postOrder: async (request, response) => {
    try {
      const { id } = request.params
      const resultRequest = []
      const resultStruture = []
      let totalProduct = 0
      for (let i = 0; i < request.body.orders.length; i++) {
        let { product_id, order_qty } = request.body.orders[i]
        const product = await getProductByIdModel(product_id)
        if (product[0] === undefined) {
          return helper.response(response, 400, 'Product not found :(')
        }
        console.log(product[0].product_price)
        totalProduct += order_qty * product[0].product_price
      }
      const setData = {
        user_id: id,
        history_invoice: Math.floor(100000 + Math.random() * 900000),
        history_subtotal: totalProduct,
        history_created_at: new Date()
      }
      const historyResult = await postHistoryModel(setData)
      resultRequest.push(setData)
      for (let i = 0; i < request.body.orders.length; i++) {
        let { product_id, order_qty } = request.body.orders[i]
        const product = await getProductByIdModel(product_id)
        console.log(product[0].product_price)
        const SetDataOrderId = {
          user_id: id,
          product_id,
          history_id: historyResult.history_id,
          product_price: product[0].product_price,
          order_price: product[0].product_price * order_qty,
          order_qty: order_qty,
          order_total: totalProduct,
          order_created_at: new Date()
        }
        await postDataOrderModel(SetDataOrderId)
        resultStruture.push(SetDataOrderId)
      }
      return helper.response(response, 200, ' Success :)', {
        history: resultRequest,
        orders: resultStruture
      })
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  patchHistory: async (request, response) => {
    try {
      const { id } = request.body
      const setData = {
        history_invoices: Math.floor(100000 + Math.random() * 900000),
        history_subtotal: 0,
        history_created_at: new Date()
      }
      const result = await patchHistoryModel(setData, id)
      return helper.response(response, 201, 'History Updated', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  incomeHistory: async (request, response) => {
    try {
      console.log('Program succes running')
      const total = await incomeHistory()
      return helper.response(response, 200, 'Dashboard', total)
    } catch (error) {
      return helper.response(response, 400, ' Bad Request', error)
    }
  }
}
