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

const checkValue = require('../bin/url_numbers_generator/zeros_pattern');
const Parser = require('../bin/url_parser/url-parser');

getLanding = (req, res, next) => {
    res.render("download", {
        // msgs: req.flash('success'),
        mixed: false,
    })
};

urlParser = (req, res, next) => {
    const result = Parser.parseURL(req.body.url);
    req.session.origin = result.origin;

    // res.send(req.body);
    res.render('path_parser', {
        pathArr: result.pathArr
    });
}

pathParser = (req, res, next) => {
    let tmp_inputArr = req.body.url_path;
    let inputArr = [];

    tmp_inputArr.map((ele) => {
        let tmp_ele = ele.split(' - ');
        inputArr.push({
            index: tmp_ele[0],
            text: tmp_ele[1]
        });
    })

    // res.send(inputArr);
    console.log(req.body.pathArr);

    res.render('input_parser', {
        pathArr: req.body.pathArr,
        inputArr: inputArr
    });
}

inputParser = (req, res, next) => {
    let { pathArr, inputs } = req.body;
    let { origin } = req.session;

    const urls = Parser.generateNewUrls(origin, pathArr, inputs);
    req.session.urls = urls;

    res.render("download", {
        mixed: true,
    });
}

var global_download_task = false;
var all_download_task = false;

var downloaded_pages = [];

// =======================================================
// download all files
downloadAllPost = (req, res, next) => {
    require('../services/file-console-log')

    const FOLDER_DIR = "data/imgs/";
    let {
        NTYPE,
        DTYPE,
        website,
        FOLDER_NAME,
        FILE_NAME,
        URI_START,
        URI_END,
        FILE_TYPE,
        PAGES,
        BASIS,
    } = req.body;

    const START_NUM = Number(req.body.START_NUM);
    const FINISH_NUM = Number(req.body.FINISH_NUM);

    // TODO:: if !== FINISH_NUM -> index++
    // console.log(typeof(Number(process.env.FINISH_NUM)));

    const total_dir = FOLDER_DIR + FOLDER_NAME
    if (!req.session.urls) {
        total_imgs_num = FINISH_NUM - START_NUM;
    } else {
        total_imgs_num = req.session.urls;
        console.log("urls: ", total_imgs_num);
    }

    // ensureDir With a callback:
    fs.ensureDir(total_dir, err => {
        err ? console.log(err) // => null 
            :
            // dir has now been created, including the directory it is to be placed in
            console.log("Folder created OR Already found");
    })

    var download_task;

    if (DTYPE == "ALL") {
        DownloadAllNormalPattern(res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE)
    }
    if (DTYPE == "SELECT") {
        DownloadSelectNormalPattern(res, PAGES, PAGES.length, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
    }

    // // add the test sample to download.samples file
    // let newSample = {
    //     name: `${FOLDER_NAME}`,
    //     website: `${website}`,
    //     link: `${URI_START}{page_number}${URI_END}`
    // }
    // addNewSampleToFile(newSample);
};

function DownloadAllNormalPattern(res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
    console.log("----------- Started Download All Normal Pattern ---------------");

    downloaded_pages.length = 0;
    let lost_pages = [];

    if (NTYPE == "NORMAL") {
        normalNumbering(res, NTYPE, total_imgs_num, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
    }
    if (NTYPE == "CIPHER") {
        cipherNumbering(res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
    }

    if (NTYPE == "MIXED") {
        mixedNumbering(res, total_imgs_num, total_dir, FILE_NAME, FILE_TYPE);
    }

}

function mixedNumbering(res, _urls, total_dir, FILE_NAME, FILE_TYPE) {
    downloaded_pages.length = 0;
    let lost_pages = [];

    // FOR LOOP STARTS => zero pattern numbers
    for (let index = 1; index <= _urls.length; index++) {
        const element = index;
        if (element == undefined) continue;

        let uri = `${_urls[index - 1]}`;
        let f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

        console.log('uri: ', uri);
        console.log('length: ', _urls.length);
        

        f.on("finish", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::DONE::${element}`
            });
            if (lost_pages.length + downloaded_pages.length == _urls.length) {
                all_download_task = true;
            }
        });

        f.on('close', () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::CLOSED::${element}`,
                downloaded_pages: downloaded_pages.length,
                lost_pages: lost_pages.length,
                urls: _urls.length,
                total: ((lost_pages.length + downloaded_pages.length) == _urls.length),
                all_download_task: all_download_task
            });

            if (all_download_task && lost_pages.length == 0) {
                res.send("Download Succeeded...")

            } else if (all_download_task && lost_pages.length > 0) {
                console.log("HERE")
                res.send({
                    msg: `STREAM::WRITE::PIPE::CLOSED::${element}`,
                    downloaded_pages: downloaded_pages.length,
                    lost_pages: lost_pages.length,
                    urls: _urls.length,
                    total: ((lost_pages.length + downloaded_pages.length) == _urls.length),
                    all_download_task: all_download_task
                })
                // DownloadSelectNormalPattern(res, lost_pages, total_imgs_num, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
            }
        })

        needle.get(uri, (error, response) => {
            // console.log(response)
            if (!error && response.statusCode == 200) {
                downloaded_pages.push(element);
            } else {
                lost_pages.push(element);
                console.log({
                    msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
                    err: error,
                });
                // return;
            }
        }).pipe(f);
    }
}

// https://papers.rgrossman.com/proc-
function cipherNumbering(res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
    var _pages_num = checkValue(START_NUM, BASIS, 0, FINISH_NUM);
    _pages_num.pop(-1);
    console.log(_pages_num);

    downloaded_pages.length = 0;
    let lost_pages = [];

    // FOR LOOP STARTS => zero pattern numbers
    for (let index = 0; index <= _pages_num.length; index++) {
        const element = _pages_num[index];
        if (element == undefined) continue;

        let uri = `${URI_START}${element}${URI_END}`;
        let f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

        f.on("finish", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::DONE::${element}`
            });
            if (lost_pages.length + downloaded_pages.length == total_imgs_num) {
                all_download_task = true;
            }
        });

        f.on('close', () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::CLOSED::${element}`,
                downloaded_pages: downloaded_pages.length,
                lost_pages: lost_pages.length,
                total_imgs_num: total_imgs_num,
                total: ((lost_pages.length + downloaded_pages.length) == total_imgs_num),
                all_download_task: all_download_task
            });

            if (all_download_task && lost_pages.length == 0) {
                res.send("Download Succeeded...")

            } else if (all_download_task && lost_pages.length > 0) {
                console.log("HERE")
                DownloadSelectNormalPattern(res, lost_pages, total_imgs_num, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
            }
        })

        needle.get(uri, (error, response) => {
            // console.log(response)
            if (!error && response.statusCode == 200) {
                downloaded_pages.push(element);
            } else {
                lost_pages.push(element);
                console.log({
                    msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
                    err: error,
                });
                // return;
            }
        }).pipe(f);
    }
}

function normalNumbering(res, NTYPE, total_imgs_num, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
    downloaded_pages.length = 0;
    let lost_pages = [];

    // FOR LOOP STARTS => normal pattern numbers
    for (let index = 0; index <= total_imgs_num - 1; index++) {
        const element = START_NUM + index - 1;
        if (element == undefined) continue;

        let uri = `${URI_START}${element}${URI_END}`;
        let f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

        f.on("finish", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::DONE::${element}`
            });
            if (lost_pages.length + downloaded_pages.length == total_imgs_num) {
                all_download_task = true;
            }
        });

        f.on('close', () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::CLOSED::${element}`,
                downloaded_pages: downloaded_pages.length,
                lost_pages: lost_pages.length,
                total_imgs_num: total_imgs_num,
                total: ((lost_pages.length + downloaded_pages.length) == total_imgs_num),
                all_download_task: all_download_task
            });

            if (all_download_task && lost_pages.length == 0) {
                res.send("Download Succeeded...")

            } else if (all_download_task && lost_pages.length > 0) {
                console.log("HERE")
                DownloadSelectNormalPattern(res, lost_pages, lost_pages.length, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
            }
        })

        needle.get(uri, (error, response) => {
            // console.log(response)
            if (!error && response.statusCode == 200) {
                downloaded_pages.push(element);
            } else {
                lost_pages.push(element);
                console.log({
                    msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
                    err: error,
                });
            }
        }).pipe(f);
    }
}

// ===================================================

function DownloadSelectNormalPattern(res, PAGES, total_imgs_num, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
    console.log("----------- Started Download Select Normal Pattern ---------------");
    // if (PAGES.length == 0) res.send("Somehow, No other page to download...");

    // var str = "5,15,150";
    // .replace(/ /g, "")

    let selective_download_task = false;

    var lost_pages = [];
    lost_pages.length = 0;

    console.log({
        PAGES: PAGES,
        total_imgs_num: total_imgs_num,
        downloaded_pages: downloaded_pages.length,
        lost_pages: lost_pages.length,
    })

    let uri;
    let f;

    for (let index = 0; index <= PAGES.length - 1; index++) {
        const element = PAGES[index];
        if (element == undefined) continue;
        uri = `${URI_START}${element}${URI_END}`;
        f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

        f.on("ready", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::READY::${element}`
            });
        });

        f.on("open", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::OPEN::${element}`
            });
        });

        f.on("finish", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::DONE::${element}`
            });

            if ((lost_pages.length + downloaded_pages.length) == total_imgs_num) {
                selective_download_task = true;
            }
        });

        f.on('close', () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::CLOSED::${element}`,
                downloaded_pages: downloaded_pages.length,
                lost_pages: lost_pages.length,
                PAGES: PAGES.length,
                total_imgs_num: total_imgs_num,
                selective_download_task: selective_download_task,
                global_download_task: global_download_task,
            });

            if (selective_download_task && downloaded_pages.length == total_imgs_num && lost_pages.length != PAGES.length && lost_pages.length == 0) {
                all_download_task = false;
                res.send("Download Succeeded...");

            } else if (selective_download_task && lost_pages.length < PAGES.length && lost_pages.length != 0) {
                DownloadSelectNormalPattern(res, lost_pages, total_imgs_num, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);

            } else if (selective_download_task && lost_pages.length == PAGES.length) {
                all_download_task = false;
                res.send("Download Failed...");
            }
        })

        needle.get(uri, function (error, response) {
            // console.log(response)
            if (!error && response.statusCode == 200) {
                downloaded_pages.push(element);
            } else {
                lost_pages.push(element);
                console.log({
                    msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
                    err: error,
                });
            }
        }).pipe(f);
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
    for (let index = START_PAGE; index <= END_PAGE - 1; index++) {
        // NEW
        var img = doc.openImage(`${IMGS_DIR}${IMAGE_NAME}${index}.jpg`);
        doc.addPage({ size: [img.width, img.height] });
        doc.image(img, 0, 0);

        // OLD
        // doc.image(`data/imgs/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.${FILE_TYPE}`, 0, 0, { width: 600 });
        // doc.addPage().image(`data/imgs/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.${FILE_TYPE}`, 0, 0, 'A4');
    }

    doc.end();
    res.send('<h1>PDFing Finished</h1>');
}


module.exports = { inputParser, urlParser, pathParser, getLanding, downloadAllPost, pdfing };