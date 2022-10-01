const path = require('path')
const express = require('express')
const route = express.Router()

// const controllers = require(path.resolve(__basename, 'controllers', 'controllers'))
const controllers = require('../controllers/app.controllers')
const stepsHelper = require('../controllers/helpers/steps.helper')
const MoveChosenFiles = require('../bin/move_chosen_files/move_chosen_files');

route.get('/', controllers.getLanding);
// 1. Choose System
route.get('/choose_sys', stepsHelper.getChooseSys);
// 2. URL Parser
route.post('/url_parser', stepsHelper.urlParser);
// 3. Path Parser
route.post('/path_parser', stepsHelper.pathParser);
// 4. Input Parser
route.post('/input_parser', stepsHelper.inputParser);
// 5. Result
route.get('/result', stepsHelper.getResult);

route.post('/api/download', controllers.downloadPost)
route.post('/api/pdf', controllers.pdfing)

route.post('/api/filter', (req, res) => {
    MoveChosenFiles(`data/imgs/${req.body.FOLDER_NAME}`)
})

module.exports = route;