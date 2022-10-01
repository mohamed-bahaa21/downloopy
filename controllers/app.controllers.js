const path = require("path");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
var needle = require('needle');
const fs = require('fs-extra')
PDFDocument = require('pdfkit');
const checkValue = require('../bin/url_numbers_generator/zeros_pattern');

var { global_download_task, all_download_task, downloaded_pages } = require('./helpers/global.controller')

var { DownloadAllPattern,
    DownloadSelectMixedPattern,
    DownloadSelectPattern } = require('./helpers/downloadPatterns.helper')

getLanding = (req, res, next) => {
    res.render("landing", {
        // msgs: req.flash('success'),
        mixed: false,
    })
};

// =======================================================
// download all files
downloadPost = (req, res, next) => {
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
        DownloadAllPattern(res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE)
    }
    if (DTYPE == "SELECT") {
        DownloadSelectPattern(res, PAGES, PAGES.length, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
    }

    // // add the test sample to download.samples file
    // let newSample = {
    //     name: `${FOLDER_NAME}`,
    //     website: `${website}`,
    //     link: `${URI_START}{page_number}${URI_END}`
    // }
    // addNewSampleToFile(newSample);
};

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


module.exports = { getLanding, downloadPost, pdfing };