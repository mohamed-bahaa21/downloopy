const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}), bodyParser.json());

const routes = require('./routes/app.routes');
app.use('/', routes)

app.listen(3000, console.log("Main Server: 3000"));