const express = require('express')
require('dotenv').config()
const app = express()

const routesNavigation = require('./src/routesNavigation')

const morgan = require('morgan')
app.use(morgan('dev'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const cors = require('cors')
app.use(cors())
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Accept, Authorization'
  )
  next()
})

app.use('/', routesNavigation)
app.use('/', express.static('uploads/product'))
app.use('/', express.static('uploads/user'))
app.get('*', (request, response) => {
  response.status(404).send('Path not found !')
})

app.listen(process.env.port, () => {
  console.log(`Express app is listening on port ${process.env.port}`)
})
