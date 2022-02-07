const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
// const request = Promise.promisifyAll(require("request"), {
//     multiArgs: true
// });
var needle = require('needle');
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

var global_download_task = false;
var downloaded_pages = [];
var lost_pages = [];

// =======================================================
// download all files
downloadAllPost = (req, res, next) => {
    require('../services/file-console-log')

    const FOLDER_DIR = "data/imgs/";
    const {
        DTYPE,
        website,
        FOLDER_NAME,
        FILE_NAME,
        URI_START,
        URI_END,
        FILE_TYPE,
        PAGES
    } = req.body;

    const START_NUM = Number(req.body.START_NUM);
    const FINISH_NUM = Number(req.body.FINISH_NUM);
    // TODO:: if !== FINISH_NUM -> index++
    // console.log(typeof(Number(process.env.FINISH_NUM)));

    // const checkValue = require('../bin/url_numbers_generator/zeros_pattern');
    // var _pages_num = checkValue(START_NUM, '00', 0, FINISH_NUM);

    const total_dir = FOLDER_DIR + FOLDER_NAME
    const total_imgs_num = FINISH_NUM - START_NUM;

    // ensureDir With a callback:
    fs.ensureDir(total_dir, err => {
        err ? console.log(err) // => null 
            :
            // dir has now been created, including the directory it is to be placed in
            console.log("Folder created OR Already found");
    })

    var download_task;

    if (DTYPE == "ALL") {
        download_task = DownloadAllNormalPattern(total_imgs_num, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE)

        if (global_download_task) {
            res.send(download_task);
        }
    }
    if (DTYPE == "SELECT") {
        download_task = DownloadSelectNormalPattern(PAGES, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
    }

    // // add the test sample to download.samples file
    // let newSample = {
    //     name: `${FOLDER_NAME}`,
    //     website: `${website}`,
    //     link: `${URI_START}{page_number}${URI_END}`
    // }
    // addNewSampleToFile(newSample);
};

// FOR LOOP STARTS => normal pattern numbers
function DownloadAllNormalPattern(total_imgs_num, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
    console.log("----------- Started Download All Normal Pattern ---------------");

    let all_download_task = false;

    for (let index = 0; index <= total_imgs_num; index++) {
        const element = START_NUM + index;
        if (element == undefined) continue;
        // console.log(element);

        const uri = `${URI_START}${element}${URI_END}`;

        let f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

        f.on("finish", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::DONE::${element}`
            });
        });

        f.on('close', () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::CLOSED::${element}`,
                stats: `downloaded_pages: ${downloaded_pages.length} | lost_pages: ${lost_pages.length}`
            });

            if ((lost_pages.length + downloaded_pages.length) == total_imgs_num) {
                all_download_task = true;
                console.log(`downloaded_pages: ${downloaded_pages.length} | lost_pages: ${lost_pages.length}`);
            }

            if (all_download_task && lost_pages.length == 0) {
                global_download_task = true;
                return "Download Succeeded";

            } else if (all_download_task && lost_pages.length > 0) {
                let selective_download = DownloadSelectNormalPattern(lost_pages, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);

                if (global_download_task) {
                    return selective_download;
                }
            }
        })

        let stream = needle
            .get(uri, function (error, response) {
                if (!error && response.statusCode == 200) {
                    downloaded_pages.push(element)
                } else {
                    lost_pages.push(element);
                    f.end(() => {
                        console.log({
                            msg: `STREAM::WRITE::PIPE::ERROR::${element}`
                        });
                    });
                }
            })
            .pipe(f)

        stream.on('finish', function () {
            console.log({
                msg: `STREAM::NEEDLE::FINISHED::${element}`
            });
        });
    }
    // else {
    //     global_download_task = true;
    //     return "Download Failed..."
    // }

}

function DownloadSelectNormalPattern(PAGES, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
    console.log("----------- Started Download Select Normal Pattern ---------------");
    if (PAGES.length == 0) return "Somehow, No other page to download...";

    // var str = "5,15,150";
    // .replace(/ /g, "")

    let selective_download_task = false;

    let numPagesArr = [];
    if (typeof PAGES == String) {
        PAGES.split(' ').map(i => {
            numPagesArr.push(Number(i));
        })
    } else {
        numPagesArr = PAGES;
    }

    console.log("Selected Pages: ", numPagesArr);

    let uri;
    let f;

    for (let index = 0; index <= numPagesArr.length; index++) {
        const element = numPagesArr[index];
        if (element == undefined) continue;
        // console.log(element);

        uri = `${URI_START}${element}${URI_END}`;

        f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

        f.on("finish", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::DONE::${element}`
            });
        });

        f.on('close', () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::CLOSED::${element}`,
                stats: `downloaded_pages: ${downloaded_pages.length} | lost_pages: ${lost_pages.length}`
            });

            if ((lost_pages.length + downloaded_pages.length) == numPagesArr.length) {
                selective_download_task = true;
                console.log(`downloaded_pages: ${downloaded_pages.length} | lost_pages: ${lost_pages.length}`);
            }

            if (selective_download_task && downloaded_pages.length == numPagesArr.length && lost_pages.length != numPagesArr.length && lost_pages.length == 0) {
                global_download_task = true;
                return "Download Succeeded...";

            } else if (selective_download_task && lost_pages.length < numPagesArr.length && lost_pages.length != 0) {
                DownloadSelectNormalPattern(lost_pages, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);

            } else if (lost_pages.length == numPagesArr.length) {
                global_download_task = true;
                return "Download Failed...";
            }
        })

        let stream = needle
            .get(uri, function (error, response) {
                if (!error && response.statusCode == 200) {
                    downloaded_pages.push(element);
                } else {
                    lost_pages.push(element);
                    f.end(() => {
                        console.log({
                            msg: `STREAM::WRITE::PIPE::ERROR::${element}`
                        });
                    });
                }
            })
            .pipe(f)

        stream.on('finish', function () {
            console.log({
                msg: `STREAM::NEEDLE::FINISHED::${element}`
            });
        });
    }

}



// =======================================================
// Add images to a PDF File
const pdfing = (req, res, next) => {

    const {
        FILE_TYPE,
        FOLDER_NAME,
        FILE_NAME,
        IMAGE_NAME,
        START_PAGE,
        END_PAGE
    } = req.body;


    const FOLDER_DIR = `data/imgs/${FOLDER_NAME}/`;
    const IMGS_DIR = `data/imgs/${FOLDER_NAME}/`;

    const total_dir = FOLDER_DIR + FOLDER_NAME

    // ensureDir With a callback:
    fs.ensureDir(total_dir, err => {
        err ? console.log(err) // => null 
            :
            // dir has now been created, including the directory it is to be placed in
            console.log("Folder created OR Already found");
    })

    var doc = new PDFDocument({ autoFirstPage: false });

    //Pipe its output somewhere, like to a file or HTTP response 
    //See below for browser usage 
    doc.pipe(fs.createWriteStream(`${FOLDER_DIR}${FILE_NAME}`))
    //Add an image, constrain it to a given size, and center it vertically and horizontally 
    for (let index = START_PAGE; index <= END_PAGE; index++) {
        // NEW
        var img = doc.openImage(`${IMGS_DIR}${IMAGE_NAME}${index}.${FILE_TYPE}`);
        doc.addPage({ size: [img.width, img.height] });
        doc.image(img, 0, 0);

        // OLD
        // doc.image(`data/imgs/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.${FILE_TYPE}`, 0, 0, { width: 600 });
        // doc.addPage().image(`data/imgs/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.${FILE_TYPE}`, 0, 0, 'A4');
    }

    doc.end();
    res.send('<h1>PDFing Finished</h1>');
}

module.exports = { getLanding, downloadAllPost, pdfing };