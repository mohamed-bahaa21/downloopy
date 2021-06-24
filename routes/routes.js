const path = require('path')
const express = require('express')
const route = express.Router()

// const controllers = require(path.resolve(__basename, 'controllers', 'controllers'))
const controllers = require('../controllers/controllers')

route.get('/', controllers.downloadOne)

module.exports = route;