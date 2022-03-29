var path = require('path');
var fs = require('fs-extra');
var util = require('util');

let date = Date.now()

var log_file = fs.createWriteStream(__dirname + `/../debug/debug-${date}.log`, { flags: 'w' });
var log_stdout = process.stdout;

console.log = function (d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};