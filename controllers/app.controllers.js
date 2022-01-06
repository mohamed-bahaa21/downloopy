const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
// const request = Promise.promisifyAll(require("request"), {
//     multiArgs: true
// });
const request = require("request")
// const { response } = require("express");
var progress = require('progress-stream');
// var fs = require('fs');
const fs = require('fs-extra')
// const fs = Promise.promisifyAll(require("fs-extra"));
PDFDocument = require('pdfkit');
// const htmlparser2 = require("htmlparser2");
var domtoimage = require('dom-to-image');

const addNewSampleToFile = require('../services/fs_push_download_test_sample/fs_push_download_test_sample')

// landing
getLanding = (req, res, next) => {
    res.render("index", {
        // msgs: req.flash('success'),
    })
};





// FOR LOOP STARTS => normal pattern numbers
// for (let index = 0; index <= total_imgs_num; index++) {
//     const element = START_NUM + index;
//     console.log(element);

//     const uri = `${URI_START}${element}${URI_END}`;

//     request.head(uri, function (err, res, body) {
//         // console.log("content-type:", res.headers["content-type"]);
//         // console.log("content-length:", res.headers["content-length"]);
//         // check file size before downloading, if !maxSize download else write a blank file.
//         let maxSize = false;
//         if (!maxSize) {
//             var f = fs.createWriteStream(`${total_dir}/IMG-${element}.${FILE_TYPE}`);

//             f.on("finish", () => {
//                 console.log({
//                     msg: `STREAM::WRITE::PIPE::DONE__IMG::${element}`
//                 });
//             });
//             f.on('close', () => {
//                 console.log({
//                     msg: `PIPE::CLOSED`
//                 });
//             })

//             request
//                 .get(uri)
//                 .on('response', (response) => {
//                     console.log({
//                         statusCode: response.statusCode, //200
//                         header: response.headers['content-type'], //img/${FILE_TYPE}
//                         msg: `STREAM::WRITE::PIPE::STARTED__IMG::${element}`
//                     })
//                 })
//                 .pipe(f)

//         } else {
//             var f = fs.createWriteStream(`${total_dir}/IMG-${element}.${FILE_TYPE}`);
//         }
//     });

// }

// =======================================================
// download all files
downloadAllPost = (req, res, next) => {

    const FOLDER_DIR = "data/imgs/output/";
    const {
        website,
        FOLDER_NAME,
        FILE_NAME,
        URI_START,
        URI_END,
        FILE_TYPE
    } = req.body;

    const START_NUM = Number(req.body.START_NUM);
    const FINISH_NUM = Number(req.body.FINISH_NUM);
    // TODO:: if !== FINISH_NUM -> index++
    // console.log(typeof(Number(process.env.FINISH_NUM)));

    const checkValue = require('../bin/url_numbers_generator/zeros_pattern');
    var _pages_num = checkValue(START_NUM, '00', 0, FINISH_NUM);

    const total_dir = FOLDER_DIR + FOLDER_NAME
    const total_imgs_num = FINISH_NUM - START_NUM;

    // ensureDir With a callback:
    fs.ensureDir(total_dir, err => {
        console.log(err) // => null
        // dir has now been created, including the directory it is to be placed in
        console.log("Folder Created.");
    })


    // FOR LOOP STARTS => zero pattern numbers
    for (let index = 0; index <= _pages_num.length; index++) {
        const element = _pages_num[index];
        console.log(element);

        const uri = `${URI_START}${element}${URI_END}`;

        request.head(uri, function (err, res, body) {
            // console.log("content-type:", res.headers["content-type"]);
            // console.log("content-length:", res.headers["content-length"]);
            // check file size before downloading, if !maxSize download else write a blank file.
            let maxSize = false;
            if (!maxSize) {
                var f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

                f.on("finish", () => {
                    console.log({
                        msg: `STREAM::WRITE::PIPE::DONE__${FILE_NAME}::${element}`
                    });
                });
                f.on('close', () => {
                    console.log({
                        msg: `PIPE::CLOSED`
                    });
                })

                request
                    .get(uri)
                    .on('response', (response) => {
                        console.log({
                            statusCode: response.statusCode, //200
                            header: response.headers['content-type'], //img/${FILE_TYPE}
                            msg: `STREAM::WRITE::PIPE::STARTED__${FILE_NAME}::${element}`
                        })
                    })
                    .pipe(f)

            } else {
                var f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);
            }
        });

    }

    // // add the test sample to download.samples file
    // let newSample = {
    //     name: `${FOLDER_NAME}`,
    //     website: `${website}`,
    //     link: `${URI_START}{page_number}${URI_END}`
    // }
    // addNewSampleToFile(newSample);
    res.send('<h1>Download Finished</h1>')
};




// =======================================================
// Add images to a PDF File
const pdfing = (req, res, next) => {

    const folder_name = 'مناهج البحث العلمي'
    const FOLDER_DIR = `data/imgs/output/${folder_name}/`;
    const FILE_NAME = "output.pdf";
    const start_page = 0;
    const pages_num = 203;

    const IMGS_DIR = `data/imgs/output/${folder_name}/`;

    var doc = new PDFDocument({ autoFirstPage: false });

    //Pipe its output somewhere, like to a file or HTTP response 
    //See below for browser usage 
    doc.pipe(fs.createWriteStream(`${FOLDER_DIR}${FILE_NAME}`))
    //Add an image, constrain it to a given size, and center it vertically and horizontally 
    for (let index = start_page; index <= pages_num; index++) {
        // NEW
        var img = doc.openImage(`${IMGS_DIR}IMG-${index}.${FILE_TYPE}`);
        doc.addPage({ size: [img.width, img.height] });
        doc.image(img, 0, 0);

        // OLD
        // doc.image(`data/imgs/output/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.${FILE_TYPE}`, 0, 0, { width: 600 });
        // doc.addPage().image(`data/imgs/output/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.${FILE_TYPE}`, 0, 0, 'A4');
    }

    doc.end();
    res.send('<h1>PDFing Finished</h1>');
}

module.exports = { getLanding, downloadAllPost, pdfing };