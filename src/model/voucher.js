const connection = require('../config/mysql')
module.exports = {
  getVoucherModel: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM voucher ', (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getVoucherByID: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM voucher WHERE voucher_id = ?',
        id,
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  postVoucherModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO voucher SET ?',
        setData,
        (error, result) => {
          console.log(error)
          if (!error) {
            console.log(error)
            const newResult = {
              voucher_id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  deleteVoucher: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM voucher WHERE voucher_id = ?',
        id,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
