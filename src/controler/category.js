const {
  getCategoryModel,
  getCategoryModelById,
  postCategoryModel,
  deleteCategoryModel,
  getCategoryNameById
} = require('../model/category')
const { getProductByIdModel } = require('../model/product')
const {
  getDataOrderModel,
  postDataOrderModel
} = require('../model/detailOrder')
const { postHistoryModel, getHistoryModel } = require('../model/history')
const helper = require('../helper/response')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  getCategoryIdName: async (request, response) => {
    try {
      const { id } = require.params
      const result = await getCategoryNameById(id)
      client.set(
        `getcategory: ${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify(result)
      )
      return helper.response(response, 200, 'Success Get category', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getCategory: async (request, response) => {
    try {
      const result = await getCategoryModel()
      client.set(
        `getcategory: ${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify(result)
      )
      return helper.response(response, 200, 'Success Get category', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getCategoryId: async (request, response) => {
    try {
      const { id } = request.params
      const result = await getCategoryNameById(id)
      return helper.response(
        response,
        200,
        'Get Category By id succses full ',
        result
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  },
  postCategory: async (request, response) => {
    try {
      const { category_id, category_name, category_status } = request.body
      const setData = {
        category_id,
        category_name,
        category_created_at: new Date(),
        category_status
      }
      const result = await postCategoryModel(setData)
      return helper.response(
        response,
        200,
        'Post Category Product Succes :)',
        result
      )
    } catch (error) {
      return helper.response(response, 400, 'Category failed to post :( ')
    }
  },
  deleteCategory: async (request, response) => {
    try {
      const { id } = request.params
      const result = await deleteCategoryModel(id)
      return helper.response(response, 200, `Delete ${id} Succes `, result)
    } catch (error) {
      return helper.response(response, 400, ' Bad request', error)
    }
  },
  getOrder: async (request, response) => {
    try {
      const result = await getDataOrderModel()
      return helper.response(response, 200, 'Success Get category', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },

  postOrder: async (request, response) => {
    try {
      const resultRequest = []
      const resultStruture = []
      let totalProduct = 0
      for (let i = 0; i < request.body.orders.length; i++) {
        let { product_id, order_qty } = request.body.orders[i]
        const product = await getProductByIdModel(product_id)
        if (product[0] === undefined) {
          return helper.response(response, 400, 'Produknya jatoh di jalan')
        }
        console.log(product[0].product_price)
        totalProduct += order_qty * product[0].product_price
      }
      const setData = {
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
      return helper.response(
        response,
        200,
        ' Success :)',
        resultStruture,
        resultRequest
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getHistory: async (request, response) => {
    try {
      const result = await getHistoryModel
      return helper.response(
        response,
        200,
        'get Data history suscces full',
        result
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
