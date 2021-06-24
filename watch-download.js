const express = require("express");
const bodyParser = require("body-parser");

const request = Promise.promisifyAll(require("request"), {
  multiArgs: true
});

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}), bodyParser.json());

const routes = require('./routes/routes');
app.use('/', routes)

app.listen(3000, console.log("Main Server: 3000"));