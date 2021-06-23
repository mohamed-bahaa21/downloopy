const express = require("express");
const bodyParser = require("body-parser");

const Promise = require("bluebird");

const {
  response
} = require("express");

const request = Promise.promisifyAll(require("request"), {
  multiArgs: true
});

const fs = Promise.promisifyAll(require("fs"));
PDFDocument = require('pdfkit');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}), bodyParser.json());

const pdfing = (response) => {
  doc = new PDFDocument

  //Pipe its output somewhere, like to a file or HTTP response 
  //See below for browser usage 
  doc.pipe(fs.createWriteStream('toPDF/result/output.pdf'))

  //Add an image, constrain it to a given size, and center it vertically and horizontally 
  pages_num = 60
  for (let index = 0; index < pages_num; index++) {
    doc.image(`./toPDF/image-${index}.jpg`, {
      fit: [500, 750],
      align: 'center',
      valign: 'center',
    });

    doc.addPage()
      .image(`./toPDF/image-${index}.jpg`, {
        size: 'A4',
        fit: [500, 750],
        align: 'center',
        valign: 'center',
      });
  }

  doc.end()
  response.send('<h1>PDFing Finished</h1>')
}

app.get("/", (req, res) => {
  // download(res);
  pdfing(res);
});

app.listen(3000, console.log("Main Server: 3000"));