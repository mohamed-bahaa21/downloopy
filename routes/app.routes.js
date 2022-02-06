const path = require('path')
const express = require('express')
const route = express.Router()

// const controllers = require(path.resolve(__basename, 'controllers', 'controllers'))
const controllers = require('../controllers/app.controllers')

route.get('/', controllers.getLanding)
route.post('/api/download', controllers.downloadAllPost)
route.post('/api/pdf', controllers.pdfing)

module.exports = route;