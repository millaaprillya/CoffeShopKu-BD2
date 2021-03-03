const connection = require('../config/mysql')

module.exports = {
  getDataModelProduct: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT SUM(history_subtotal) AS total_price  FROM history WHERE DATE(history_created_at) = DATE(NOW()) ',
        (error, result) => {
          !error ? resolve(result[0].total_price) : reject(new Error(error))
        }
      )
    })
  },
  incomeHistory: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT SUM(history_subtotal) as total FROM history',
        (error, result) => {
          console.log(error)
          console.log(result)
          !error ? resolve(result[0].total) : reject(new Error(error))
        }
      )
    })
  }
}
