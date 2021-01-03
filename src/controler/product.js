const {
  getProductModel,
  getProductCountModel,
  getProductByIdModel,
  postProductModel,
  patchProductModel,
  deleteProductModel,
  postVoucherModel,
  getVoucherModel,
  deleteVoucherModel
} = require('../model/product')
const { getDataModel, getDataModelProduct } = require('../model/dashboard')
const helper = require('../helper/response')
const redis = require('redis')
const client = redis.createClient()
const fs = require('fs')
const dashboard = require('../model/dashboard')

module.exports = {
  getProduct: async (request, response) => {
    try {
      let { page, limit } = request.query
      page = parseInt(page)
      limit = parseInt(limit)
      // search = ''
      // sort = ''
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
      console.log(request.query)
      console.log(qs.stringify(request.query))
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
        nextLink: nextLink && `http://localhost:3000/product?${nextLink}`,
        prevLink: prevLink && `http://localhost:3000/product?${prevLink}`
      }
      const result = await getProductModel(limit, offset)
      const newData = {
        result,
        pageInfo
      }
      console.log(newData)
      client.set(
        `getproduct: ${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify(newData)
      )
      return helper.response(response, 200, 'Success Get Product', newData)
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
        product_status
      } = request.body
      // kasih validasi disini
      const setData = {
        category_id,
        product_name,
        product_price,
        product_size,
        product_list,
        product_image: request.file === undefined ? '' : request.file.filename,
        product_created_at: new Date(),
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
        return helper.response(response, 400, 'plis Insert size product')
      } else if (setData.product_list === '') {
        return helper.response(response, 400, 'plis Insert size product')
      } else if (setData.product_status === '') {
        return helper.response(response, 400, 'Please select status')
      } else {
        const result = await postProductModel(setData)
        return helper.response(response, 200, 'Success Post Product', result)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  patchProduct: async (request, response) => {
    const { id } = request.params
    try {
      const {
        category_id,
        product_name,
        product_price,
        product_size,
        product_image,
        product_list,
        product_status
      } = request.body
      console.log(request.body.product_name)
      const setData = {
        category_id,
        product_name,
        product_price,
        product_size,
        product_list,
        product_image: request.file === undefined ? '' : request.file.filename,
        product_created_at: new Date(),
        product_status
      }
      const checkId = await getProductByIdModel(id)
      fs.unlink(`uploads/${checkId[0].product_image}`, async (error) => {
        if (error) return helper.response(response, 400, 'delete gagal')
      })
      if (checkId.length > 0) {
        const result = await patchProductModel(id, setData)
        return helper.response(response, 200, 'DataUpdated', result)
      } else {
        return helper.response(response, 404, `Data Not Found By Id ${id}`)
      }
    } catch (error) {
      return helper.response(response, 400, 'Data Failed Update', error)
    }
  },
  deleteProduct: async (request, response) => {
    try {
      const { id } = request.params
      const productId = await getProductByIdModel(id)
      console.log(productId)
      fs.unlink(`./uploads/${productId[0].product_image}`, async (error) => {
        if (error) return helper.response(response, 400, 'deleted gagal')
      })
      const result = await deleteProductModel(id)
      return helper.response(
        response,
        200,
        `Delete Product ${id} Succes `,
        result
      )
    } catch (error) {
      return helper.response(response, 400, ' Bad request', error)
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

      const setData = {
        voucher_name,
        voucher_diskon,
        voucher_list,
        voucher_created_at: new Date(),
        voucher_status
      }
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
  getVoucher: async (request, response) => {
    try {
      const result = await getVoucherModel()
      return helper.response(response, 400, 'ok', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  deleteVoucher: async (request, response) => {
    try {
      const { id } = request.params
      const result = await deleteVoucherModel(id)
      return helper.response(response, 200, 'Delete  Succes ', result)
    } catch (error) {
      return helper.response(response, 400, ' Bad request', error)
    }
  },
  getdata: async (request, response) => {
    try {
      const result = await getDataModel
      const result2 = await getDataModelProduct
      dashboard = {
        result,
        result2
      }
      return helper.response(
        response,
        200,
        'get Data history suscces full',
        dashboard
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
