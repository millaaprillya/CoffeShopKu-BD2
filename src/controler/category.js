const {
  getCategoryModel,
  postCategoryModel,
  deleteCategoryModel,
  getCategoryNameById,
  getProductCategory
} = require('../model/category')
const { getProductCountModel } = require('../model/product')
const helper = require('../helper/response')
const redis = require('redis')
const client = redis.createClient()
const qs = require('querystring')

module.exports = {
  getProductBycategory: async (request, response) => {
    try {
      let { page, limit, search, sort } = request.query
      if (!search) {
        search = ''
      }
      if (!sort) {
        sort = 'product_id ASC'
      }
      page = parseInt(page)
      limit = parseInt(limit)
      const totalData = await getProductCountModel()
      const totalPage = Math.ceil(totalData / limit)
      const offset = page * limit - limit
      const prevLink =
        page > 1
          ? qs.stringify({ ...request.query, ...{ page: page - 1 } })
          : null
      const nextLink =
        page < totalPage
          ? qs.stringify({ ...request.query, ...{ page: page + 1 } })
          : null
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
        nextLink: nextLink && `http://localhost:3000/product?${nextLink}`,
        prevLink: prevLink && `http://localhost:3000/product?${prevLink}`
      }
      const result = await getProductCategory(limit, offset, sort, search)
      console.log(result)
      return helper.response(
        response,
        200,
        'Success Get Product',
        result,
        pageInfo
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
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
  }
}
