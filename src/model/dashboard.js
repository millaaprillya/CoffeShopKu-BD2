const connection = require('../config/mysql')

module.exports = {
  getDataModel: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM voucher ', (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getDataModelProduct: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT SUM(history_subtotal) AS total_price  FROM history WHERE DATE(history_creted_at) = DATE(NOW()) ',
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
