const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
// const request = require("request")
const request = Promise.promisifyAll(require("request"), {
    multiArgs: true
});
// const { response } = require("express");
var progress = require('progress-stream');
// var fs = require('fs');
// const fs = require('fs-extra')
const fs = Promise.promisifyAll(require("fs-extra"));
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

// =======================================================
// download one file
downloadOneEnv = (req, response, next) => {

    const img_num = 378;
    const uri = `https://archive.alsharekh.org/MagazinePages/Magazine_JPG/EL_Mawred/mogalad_12/Issue_4/${img_num}.JPG`;

    request.head(uri, function (err, res, body) {
        // console.log("content-type:", res.headers["content-type"]);
        // console.log("content-length:", res.headers["content-length"]);

        // downloaded image file
        var img_filename = `imgs/IMG-${img_num}.jpg`
        var img_file = fs.createWriteStream(img_filename)

        // watch stream stat sync 
        var stat = fs.statSync(res.body);
        // watch progress stream 
        var str = progress({
            length: stat.size,
            time: 100 /* ms */
        });
        // stream on progress
        str.on('progress', function (progress) {
            console.log(progress);
        });
        // stream request uri -> pipe -> stat -> write stream -> finish
        // fs.createReadStream(img_file)
        request(uri)
            .pipe(img_file)
            .pipe(str)
            .on("finish", () => {
                console.log(`PIPE::DONE__IMG::${img_num}`);
                response.send('<h1>Download Finished</h1>')
            });

        // var filename = fs.createWriteStream(`imgs/IMG-${img_num}.jpg`);
        // request(uri)
        //     .pipe(filename)
        //     .on("finish", () => {
        //         console.log(`PIPE::DONE__IMG::${img_num}`);
        //         response.send('<h1>Download Finished</h1>')
        //     });
    });

    // filename.on("finish", function () {
    //     // do stuff
    //     console.log(`STREAM::WRITE::DONE__IMG::${img_num}`);
    // });
}

// =======================================================
// download all files
downloadAllEnv = (req, response, next) => {

    const folder_name = process.env.FOLDER_NAME
    const folder_dir = process.env.FOLDER_DIR
    const total_dir = folder_dir + folder_name

    // TODO:: if !== finish_num -> index++
    const start_num = Number(process.env.START_NUM);
    const finish_num = Number(process.env.FINISH_NUM);
    // console.log(typeof(Number(process.env.FINISH_NUM)));

    const total_imgs_num = finish_num - start_num;

    const uri_start = process.env.URI_START;
    const uri_end = process.env.URI_END;
    // console.log(uri_start);

    // ensureDir With a callback:
    fs.ensureDir(total_dir, err => {
        console.log(err) // => null
        // dir has now been created, including the directory it is to be placed in
        console.log("Folder Created.");
    })

    // FOR LOOP STARTS
    for (let index = 0; index <= total_imgs_num; index++) {
        const element = start_num + index;
        console.log(element);

        const uri = `${uri_start}${element}${uri_end}`;

        request.head(uri, function (err, res, body) {
            // console.log("content-type:", res.headers["content-type"]);
            // console.log("content-length:", res.headers["content-length"]);

            var f = fs.createWriteStream(`${total_dir}/IMG-${element}.jpg`);

            f.on("finish", function () {
                // do stuff
                console.log(`STREAM::WRITE::DONE__IMG::${element}`);
            });

            request(uri)
                .pipe(f)
                .on("finish", () => {
                    console.log(`PIPE::DONE__IMG::${element}`);
                });
        });
    }
    // FOR LOOP ENDS

    response.send('<h1>Download Finished</h1>')
};

// =======================================================
// download all files
downloadAllPost = (req, res, next) => {

    const FOLDER_DIR = "data/imgs/output/";
    const {
        FOLDER_NAME,
        URI_START,
        URI_END
    } = req.body;

    const START_NUM = 1;
    const FINISH_NUM = Number(req.body.FINISH_NUM);
    // TODO:: if !== FINISH_NUM -> index++
    // console.log(typeof(Number(process.env.FINISH_NUM)));

    const total_dir = FOLDER_DIR + FOLDER_NAME
    const total_imgs_num = FINISH_NUM - START_NUM;

    // ensureDir With a callback:
    fs.ensureDir(total_dir, err => {
        console.log(err) // => null
        // dir has now been created, including the directory it is to be placed in
        console.log("Folder Created.");
    })

    // FOR LOOP STARTS
    for (let index = 0; index <= total_imgs_num; index++) {
        const element = START_NUM + index;
        console.log(element);

        const uri = `${URI_START}${element}${URI_END}`;

        request.head(uri, function (err, res, body) {
            // console.log("content-type:", res.headers["content-type"]);
            // console.log("content-length:", res.headers["content-length"]);

            var f = fs.createWriteStream(`${total_dir}/IMG-${element}.jpg`);

            f.on("finish", function () {
                // do stuff
                console.log(`STREAM::WRITE::DONE__IMG::${element}`);
            });

            request(uri)
                .pipe(f)
                .on("finish", () => {
                    console.log(`PIPE::DONE__IMG::${element}`);
                });
        });
    }
    // FOR LOOP ENDS
    let newSample = {
        name: `${FOLDER_NAME}`,
        website: "InfoQ",
        link: "https://www.infoq.com/presentations/Scale-at-Facebook/"
    }
    addNewSampleToFile(newSample);

    res.send('<h1>Download Finished</h1>')
};




// =======================================================

// TODO
// Automate Download
// get download btn -> click -> download
autoDown = (req, res, next) => {
    res.render("index", {
        msgs: req.flash('success'),
    })
};

// TODO
// Generates an image from a DOM node using HTML5 canvas
// loop -> get -> generate -> download -> next
domToImg = (req, res, next) => {
    var node = document.getElementsByClassName('node-class-name');
    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });

    res.render("index", {
        msgs: req.flash('success'),
    })
};


// Add images to a PDF File
pdfing = (req, res, next) => {

    var doc = new PDFDocument({ autoFirstPage: false });

    //Pipe its output somewhere, like to a file or HTTP response 
    //See below for browser usage 
    doc.pipe(fs.createWriteStream('data/pdf/تغريدة السيرة النبوية شعرا ونثرا م2.pdf'))

    //Add an image, constrain it to a given size, and center it vertically and horizontally 
    pages_num = 808 + 1;
    for (let index = 1; index < pages_num; index++) {
        // NEW
        var img = doc.openImage(`data/imgs/output/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.jpg`);
        doc.addPage({ size: [img.width, img.height] });
        doc.image(img, 0, 0);

        // OLD
        // doc.image(`data/imgs/output/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.jpg`, 0, 0, { width: 600 });
        // doc.addPage().image(`data/imgs/output/تغريدة السيرة النبوية شعرا ونثرا م2/IMG-${index}.jpg`, 0, 0, 'A4');
    }

    doc.end();
    res.send('<h1>PDFing Finished</h1>');
}

module.exports = { getLanding, downloadOneEnv, downloadAllEnv, downloadAllPost, autoDown, domToImg, pdfing };