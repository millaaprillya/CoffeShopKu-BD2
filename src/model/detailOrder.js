const connection = require('../config/mysql')

module.exports = {
  getDataOrderModel: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM orders ', (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getOrderBy_userid: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM orders ', (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getDataOrderBy_id: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM orders WHERE user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getOrderByhistory: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT orders.order_id, product.product_name, product.product_price, orders.order_qty, 
        orders.order_price FROM orders INNER JOIN product ON orders.product_id = product.product_id 
        INNER JOIN history ON history.history_id = orders.history_id WHERE orders.history_id = ?`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  postDataOrderModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO orders SET ?', setData, (error, result) => {
        if (!error) {
          const newResult = {
            order_id: result.insertId,
            ...setData
          }
          resolve(newResult)
        } else {
          reject(new Error(error))
        }
      })
    })
  }
}
