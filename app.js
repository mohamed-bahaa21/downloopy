const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

let env = dotenv.config({})
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);
// console.log(env);

const express = require("express");
const bodyParser = require("body-parser");

const cookieParser = require('cookie-parser')
// const session = require('express-session');
const session = require('cookie-session');

const app = express();

app.set('view engine', 'ejs');
app.use(
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    express.static(__dirname + '/public'),
    cookieParser("@010#44$vm=2001ayk2020horizon"),
    session({
        secret: '@010#44$vm=2001ayk2020horizon',
        name: 'sessionId',
        resave: true,
        saveUninitialized: true,
        path: '/',
        httpOnly: false,
        secure: true,
        domain: 'localhost',
        expires: 1000000
    }),
);

const routes = require('./routes/app.routes');
app.use('/', routes);

app.listen(3000, console.log("Main Server: 3000"));