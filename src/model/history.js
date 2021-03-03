const connection = require('../config/mysql')

module.exports = {
  getHistoryModel: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM history ', (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getHistoryModelById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM history WHERE user_id = ? ',
        id,
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getHistoryById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT orders.*, product.product_name, product.product_image FROM orders INNER JOIN product ON orders.product_id =product.product_id WHERE history_id= ? ',
        id,
        (error, result) => {
          console.log(result)
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  patchHistoryModel: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE history SET ? WHERE history_id = ?',
        [setData, id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  postHistoryModel: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO history SET ?',
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              history_id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  }
}
