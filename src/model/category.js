const connection = require('../config/mysql')

module.exports = {
  getCategoryModel: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM category ', (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getCategoryNameById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM product WHERE category_id =?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getCategoryModelById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM  category WHERE category_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  postCategoryModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO category SET ?',
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              category_id: result.insertId,
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
  deleteCategoryModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM category WHERE category_id = ?',
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
