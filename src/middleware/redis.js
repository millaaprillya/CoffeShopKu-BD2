const redis = require('redis')
const client = redis.createClient()
const helper = require('../helper/response')

module.exports = {
  getProductByIdRedis: (request, response, next) => {
    const { id } = request.params
    client.get(`getproductbyid:${id}`, (error, result) => {
      if (!error && result !== null) {
        console.log('data di dalam redis ')
        return helper.response(
          response,
          200,
          'Succes get product by id',
          JSON.parse(result)
        )
      } else {
        console.log('data di dalam redis tidak ada')
        next()
      }
    })
  },
  getProductRedis: (request, response, next) => {
    client.get(
      `getproduct:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result != null) {
          const newResult = JSON.parse(result)
          return helper.response(
            response,
            200,
            'Success Get Product',
            newResult.result,
            newResult.pageInfo
          )
        } else {
          next()
        }
      }
    )
  },
  clearDataProductRedis: (request, response, next) => {
    client.keys('getproduct*', (_error, result) => {
      console.log(result)
      if (result.length > 0) {
        result.forEach((value) => {
          client.del(value)
        })
      }
      next()
    })
  },
  getCategoryRedis: (request, response, next) => {
    client.get(
      `getcategory:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result != null) {
          const newResult = JSON.parse(result)
          return helper.response(
            response,
            200,
            'Success Get Product',
            newResult.result
          )
        } else {
          next()
        }
      }
    )
  }
}
