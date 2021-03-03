// const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const helper = require('../helper/response')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const {
  registerUserModel,
  loginCheckModel,
  getUserModel,
  getUserByIdModel,
  patchUsertModel,
  getUserByKeyModel
} = require('../model/user')

module.exports = {
  getUserById: async (request, response) => {
    try {
      const { id } = request.params
      const result = await getUserByIdModel(id)
      return helper.response(
        response,
        200,
        'get Data history suscces full',
        result
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getUser: async (request, response) => {
    try {
      const result = await getUserModel()
      return helper.response(
        response,
        200,
        'get Data history suscces full',
        result
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  patchUser: async (request, response) => {
    try {
      const { id } = request.params
      const {
        user_name,
        user_lastname,
        user_birth,
        user_gender,
        user_phone,
        user_address,
        user_email
      } = request.body
      const setData = {
        user_name,
        user_lastname,
        user_birth,
        user_gender,
        user_phone,
        user_address,
        user_img: request.file.filename,
        user_email,
        user_role: 2,
        user_created_at: new Date()
      }
      const checkId = await getUserByIdModel(id)
      if (!checkId) {
        return helper.response(response, 404, `user by id ${id} empty`)
      } else if (checkId[0].user_image < 0) {
        const postUserImg = await patchUsertModel(setData, id)
        return helper.response(response, 400, ' Succes Updated ', postUserImg)
      } else if (checkId.length > 0) {
        fs.unlink(`./uploads/user/${checkId[0].user_img}`, async (error) => {
          if (error) {
            throw error
          } else {
            const result = await patchUsertModel(setData, id)
            return helper.response(response, 201, 'Succes Updated', result)
          }
        })
      } else {
        return helper.response(response, 404, `Data Not Found By Id ${id}`)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  registerUser: async (request, response) => {
    try {
      const {
        user_name,
        user_lastname,
        user_birth,
        user_gender,
        user_phone,
        user_address,
        user_email,
        user_password
      } = request.body
      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(user_password, salt)
      const setData = {
        user_name,
        user_lastname,
        user_birth,
        user_gender,
        user_phone,
        user_address,
        user_img: request.file === undefined ? '' : request.file.filename,
        user_email,
        user_role: 2,
        user_password: encryptPassword,
        user_created_at: new Date()
      }
      const checkDataUser = await loginCheckModel(user_email)
      if (checkDataUser.length >= 1) {
        return helper.response(response, 400, 'Email has been Register ')
      } else if (request.body.user_email === '') {
        return helper.response(response, 400, 'Insert EMAIL Please :))')
      } else if (request.body.user_password === '') {
        return helper.response(response, 400, 'Insert Password Please')
      } else if (request.body.user_phone === '') {
        return helper.response(response, 400, 'Insert your Phone Please')
      } else {
        const result = await registerUserModel(setData)
        return helper.response(response, 200, 'Succes Register ', result)
      }
    } catch (error) {
      return helper.response(response, 404, 'Bad requet', error)
    }
  },
  loginUser: async (request, response) => {
    try {
      const { user_email, user_password } = request.body

      // condition 1 pengecekan apakah email ada di database
      if (request.body.user_email === '') {
        return helper.response(response, 400, 'Insert email Please :)')
      } else if (request.body.user_password === '') {
        return helper.response(response, 400, 'Insert Password Please :)')
      } else {
        const checkDataUser = await loginCheckModel(user_email)

        if (checkDataUser.length > 0) {
          // proses check password  sesuai atau tidak
          const checkPassword = bcrypt.compareSync(
            user_password,
            checkDataUser[0].user_password
          )

          if (checkPassword) {
            // set jwt disini
            const {
              user_id,
              user_name,
              user_email,
              user_role
            } = checkDataUser[0]
            const paylot = {
              user_id,
              user_name,
              user_email,
              user_role
            }
            const token = jwt.sign(paylot, 'RAHASIA', { expiresIn: '4h' })
            const result = { ...paylot, token }
            return helper.response(response, 200, 'Succes', result)
          } else {
            return helper.response(response, 404, 'wrong password !')
          }
        } else {
          return helper.response(response, 404, 'account not register !')
        }
      }
    } catch (error) {
      return helper.response(response, 404, 'bad request', error)
    }
  },
  forgotPassword: async (request, response) => {
    try {
      const { user_email } = request.body
      if (!user_email) {
        return helper.response(response, 404, 'Insert Email first')
      }
      const checkDataUser = await loginCheckModel(user_email)
      const keys = Math.round(Math.random() * 10000)
      if (checkDataUser.length >= 1) {
        const setData = {
          user_key: keys,
          user_update_at: new Date()
        }
        await patchUsertModel(setData, checkDataUser[0].user_id)
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'kostkost169@gmail.com',
            pass: 'admin@123456'
          }
        })
        const mailOptions = {
          from: '"CoffeShopKu.com 👻" <CoffeShopKu@gmail.com', // sender address
          to: user_email, // list of receivers
          subject: 'CoffeShopKu.com - Forgot Password', // Subject line
          html: `<p>To Account   ${user_email}</p>
          <p>Hello I am milla personal team from CoffeShopku.com will help you to change your new password, please activate it on this page</p>
          <a href=" ${process.env.VUE_APP_reset}/changePassword/${keys}">Click Here To Change Password</a>`
        }
        await transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return helper.response(response, 404, 'Email not send !')
          } else {
            return helper.response(
              response,
              200,
              'Email has been send !',
              'please check your email'
            )
          }
        })
      } else {
        return helper.response(response, 404, 'Email / Account not Registed !')
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 404, 'Bad Request', error)
    }
  },
  resetPassword: async (request, response) => {
    try {
      const { keys, newPassword, confirmPassword } = request.body
      if (newPassword.length < 8 || newPassword.length > 16) {
        return helper.response(
          response,
          400,
          'Password must be 8-16 characters long'
        )
      } else if (newPassword !== confirmPassword) {
        return helper.response(response, 400, "Password didn't match")
      } else {
        const getKeys = await getUserByKeyModel(keys)
        if (getKeys.length < 1) {
          return helper.response(response, 400, 'Bad Request')
        } else {
          const userId = getKeys[0].user_id
          const update = new Date() - getKeys[0].user_updated_at
          const changeKeys = Math.floor(update / 1000 / 60)
          if (changeKeys >= 5) {
            const setData = {
              user_key: 0,
              user_update_at: new Date()
            }
            await patchUsertModel(setData, userId)
            return helper.response(
              response,
              400,
              'Please confirm password again, keys is expires :))'
            )
          } else {
            // new Password
            const salt = bcrypt.genSaltSync(7)
            const encryptPassword = bcrypt.hashSync(newPassword, salt)
            const setData = {
              user_password: encryptPassword,
              user_key: 0,
              user_update_at: new Date()
            }
            await patchUsertModel(setData, userId)
            return helper.response(response, 200, 'Success change Password ')
          }
        }
      }
    } catch (error) {
      return helper(response, 400, 'Bad Request', error)
    }
  }
}
