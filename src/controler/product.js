const {
  getProductModel,
  getProductCountModel,
  getProductByIdModel,
  postProductModel,
  patchProductModel,
  deleteProductModel
} = require('../model/product')
// const { getDataModel, getDataModelProduct } = require('../model/dashboard')
const helper = require('../helper/response')
const redis = require('redis')
const client = redis.createClient()
const fs = require('fs')
const qs = require('querystring')
module.exports = {
  getProduct: async (request, response) => {
    try {
      let { page, limit, search, sort } = request.query
      if (!search) {
        search = ''
      }
      if (!sort) {
        sort = 'product_id ASC'
      }
      if (!limit) {
        limit = 8
      }
      if (!page) {
        page = 1
      }
      page = parseInt(page)
      limit = parseInt(limit)

      console.log(search)
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
      const result = await getProductModel(limit, offset, sort, search)

      const newData = {
        result,
        pageInfo
      }
      console.log(newData)
      // client.set(
      //   `getproduct: ${JSON.stringify(request.query)}`,
      //   3600,
      //   JSON.stringify(newData)
      // )
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
  getProductById: async (request, response) => {
    try {
      console.log(request.params)
      const { id } = request.params
      const result = await getProductByIdModel(id)
      if (result.length > 0) {
        client.setex(`getproductbyid:${id}`, 3600, JSON.stringify(result))
        return helper.response(
          response,
          200,
          'Success Get Product By Id',
          result
        )
      } else {
        return helper.response(response, 404, `Product By Id : ${id} Not Found`)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  postProduct: async (request, response) => {
    try {
      const {
        category_id,
        product_name,
        product_price,
        product_size,
        product_list,
        product_stok,
        product_status
      } = request.body
      // kasih validasi disini
      const setData = {
        category_id,
        product_name,
        product_price,
        product_size,
        product_list,
        product_stok,
        product_image: request.file === undefined ? '' : request.file.filename,
        product_created_at: new Date(),
        product_status
      }
      if (setData.category_id === '') {
        return helper.response(response, 400, 'Please select category')
      } else if (setData.product_name === '') {
        return helper.response(response, 400, 'Product name cannot be empty')
      } else if (setData.product_price === '') {
        return helper.response(response, 400, 'Product price cannot be empty')
      } else if (setData.product_size === '') {
        return helper.response(response, 400, 'Product Insert size product')
      } else if (setData.product_list === '') {
        return helper.response(response, 400, 'Product Insert size product')
      } else if (setData.product_status === '') {
        return helper.response(response, 400, 'Product select status')
      } else if (setData.product_image === '') {
        return helper.response(
          response,
          400,
          'Product select image cannot to be empty'
        )
      } else {
        const result = await postProductModel(setData)
        return helper.response(response, 200, 'Success Post Product', result)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  patchProduct: async (request, response) => {
    try {
      const { id } = request.params
      const {
        category_id,
        product_name,
        product_price,
        product_size,
        product_list,
        product_status
      } = request.body
      const setData = {
        category_id,
        product_name,
        product_price,
        product_image: request.file === undefined ? '' : request.file.filename,
        product_size,
        product_list,
        product_updated_at: new Date(),
        product_status
      }
      console.log(setData)
      if (setData.category_id === '') {
        return helper.response(response, 400, 'Please select category')
      } else if (setData.product_name === '') {
        return helper.response(response, 400, 'Product name cannot be empty')
      } else if (setData.product_price === '') {
        return helper.response(response, 400, 'Product price cannot be empty')
      } else if (setData.product_size === '') {
        return helper.response(response, 400, 'Product Insert size product')
      } else if (setData.product_list === '') {
        return helper.response(response, 400, 'Product Insert size product')
      } else if (setData.product_status === '') {
        return helper.response(response, 400, 'Product select status')
      } else if (setData.product_image === '') {
        return helper.response(
          response,
          400,
          'Product select image cannot to be empty'
        )
      }

      const checkId = await getProductByIdModel(id)
      if (checkId.length > 0) {
        fs.unlink(
          `./uploads/product/${checkId[0].product_image}`,
          async (error) => {
            if (error) {
              throw error
            } else {
              const result = await patchProductModel(id, setData)
              return helper.response(response, 201, 'Product Updated', result)
            }
          }
        )
      } else {
        return helper.response(response, 404, `Product By Id : ${id} Not Found`)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  deleteProduct: async (request, response) => {
    try {
      const { id } = request.params
      const checkId = await getProductByIdModel(id)
      if (!checkId) {
        return helper.response(response, 404, `Product id ${id} empty`)
      }
      if (checkId.length > 0) {
        fs.unlink(
          `./uploads/product/${checkId[0].product_image}`,
          async (error) => {
            if (error) {
              throw error
            } else {
              const result = await deleteProductModel(id)
              return helper.response(response, 201, 'Product Deleted', result)
            }
          }
        )
      } else {
        return helper.response(response, 404, `Product By Id : ${id} Not Found`)
      }
    } catch (error) {
      console.log()
      return helper.response(response, 400, ' Bad request', error)
    }
  }
}
