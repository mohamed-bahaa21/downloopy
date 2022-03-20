const path = require('path')
const express = require('express')
const route = express.Router()

// const controllers = require(path.resolve(__basename, 'controllers', 'controllers'))
const controllers = require('../controllers/app.controllers')
const MoveChosenFiles = require('../bin/move_chosen_files/move_chosen_files');


route.get('/', controllers.getLanding)
route.post('/url_parser', controllers.urlParser)
route.post('/path_parser', controllers.pathParser)
route.post('/input_parser', controllers.inputParser)


route.post('/api/download', controllers.downloadAllPost)
route.post('/api/pdf', controllers.pdfing)

route.post('/api/filter', (req, res) => {
    MoveChosenFiles(`data/imgs/${req.body.FOLDER_NAME}`)
})

module.exports = route;