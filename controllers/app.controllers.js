const path = require("path");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
var needle = require('needle');
const fs = require('fs-extra')
PDFDocument = require('pdfkit');
const checkValue = require('../bin/url_numbers_generator/zeros_pattern');

getLanding = (req, res, next) => {
    res.render("landing", {
        // msgs: req.flash('success'),
        mixed: false,
    })
};

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
        DownloadAllPattern(res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE)
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

function DownloadAllPattern(res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
    console.log("----------- Started Download All Normal Pattern ---------------");

    downloaded_pages.length = 0;
    let lost_pages = [];

    if (NTYPE == "NORMAL") {
        console.log("----------- HERE NORMAL ---------------");
        normalNumbering(res, NTYPE, total_imgs_num, START_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
    }
    if (NTYPE == "CIPHER") {
        console.log("----------- HERE CIPHER ---------------");
        cipherNumbering(res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
    }

    if (NTYPE == "MIXED") {
        console.log("----------- HERE MIXED ---------------");
        mixedNumbering(res, total_imgs_num, total_dir, FILE_NAME, FILE_TYPE, 1, lost_pages);
    }

}

function mixedNumbering(res, _urls, total_dir, FILE_NAME, FILE_TYPE, index = 1, lost_pages) {

    console.log(`index: ${index}`);
    if (index == 1) {
        downloaded_pages.length = 0;
        var lost_pages = [];
    }

    // FOR LOOP STARTS => zero pattern numbers
    // for (let index = 1; index <= _urls.length; index++) {
    const element = index;
    if (element == undefined) {
        mixedNumbering(res, _urls, total_dir, FILE_NAME, FILE_TYPE, index++, lost_pages);
    } else {
        let uri = `${_urls[index - 1]}`;
        let f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

        console.log(`uri: ${uri}`);
        console.log(`length: ${_urls.length}`);

        f.on("finish", () => {
            console.log({
                msg: `STREAM::WRITE::PIPE::DONE::${element}`
            });
            if ((lost_pages.length + downloaded_pages.length) == _urls.length) {
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

            if (!all_download_task) {
                index = index + 1;
                mixedNumbering(res, _urls, total_dir, FILE_NAME, FILE_TYPE, index, lost_pages);

            } else if (all_download_task && lost_pages.length == 0) {
                // res.send("Download Succeeded...")
                res.redirect(`/result?result=success`)

            } else if (all_download_task && lost_pages.length > 0) {
                console.log("HERE")
                DownloadSelectMixedPattern(res, lost_pages, total_dir, FILE_NAME, FILE_TYPE);
                // res.send({
                //     msg: `STREAM::WRITE::PIPE::CLOSED::${element}`,
                //     downloaded_pages: downloaded_pages.length,
                //     lost_pages: lost_pages.length,
                //     urls: _urls.length,
                //     total: ((lost_pages.length + downloaded_pages.length) == _urls.length),
                //     all_download_task: all_download_task
                // })
                // mixedNumbering(res, total_imgs_num, total_dir, FILE_NAME, FILE_TYPE);
            }
        })

        needle
            .get(uri, (error, response) => {
                // console.log(response)
                if (!error && response.statusCode == 200) {
                    downloaded_pages.push(element);
                } else {
                    lost_pages.push({ uri, element });
                    console.log({
                        msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
                        err: error,
                    });
                    // return;
                }
            })
            .pipe(f)
            .on('done', function () {
                console.log(`${uri} :: STREAM_DONE`);
            });
    }
    // }
}
function DownloadSelectMixedPattern(res, _urls, total_dir, FILE_NAME, FILE_TYPE, index = 0) {
    console.log("----------- Started Download Select Mixed Pattern ---------------");
    // if (PAGES.length == 0) res.send("Somehow, No other page to download...");
    // var str = "5,15,150";
    // .replace(/ /g, "")

    if (index == 0) {
        var selective_download_task = false;
        var lost_pages = [];
        lost_pages.length = 0;
        var total_imgs_num = lost_pages.length;
    }

    console.log({
        _urls: _urls,
        total_imgs_num: total_imgs_num,
        downloaded_pages: downloaded_pages.length,
        lost_pages: lost_pages.length,
    })

    let f;

    // for (let index = 0; index <= _urls.length - 1; index++) {
    const element = _urls[index].element;
    const uri = _urls[index].uri;

    if (element == undefined) {
        DownloadSelectMixedPattern(res, _urls, total_dir, FILE_NAME, FILE_TYPE, index++);
    } else {
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
                _urls: _urls.length,
                total_imgs_num: total_imgs_num,
                selective_download_task: selective_download_task,
                global_download_task: global_download_task,
            });

            if (!selective_download_task) {
                DownloadSelectMixedPattern(res, lost_pages, total_dir, FILE_NAME, FILE_TYPE, index++);
            } else if (selective_download_task && downloaded_pages.length == total_imgs_num && lost_pages.length != _urls.length && lost_pages.length == 0) {
                all_download_task = false;
                // res.send("Download Succeeded...");
                res.redirect(`/result?result=success`)

            } else if (selective_download_task && lost_pages.length < _urls.length && lost_pages.length != 0) {
                DownloadSelectMixedPattern(res, lost_pages, total_dir, FILE_NAME, FILE_TYPE);

            } else if (selective_download_task && lost_pages.length == _urls.length) {
                all_download_task = false;
                // res.send("Download Failed...");
                res.redirect(`/result?result=failed`)
            } else {
                all_download_task = false;
                res.redirect(`/result?result=failed`)
            }
        })

        needle
            .get(uri, function (error, response) {
                // console.log(response)
                if (!error && response.statusCode == 200) {
                    downloaded_pages.push(element);
                } else {
                    lost_pages.push({ uri, element });
                    console.log({
                        msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
                        err: error,
                    });
                }
            })
            .pipe(f)
            .on('done', function () {
                console.log(`${uri} :: STREAM_DONE`);
            });
    }
    // }
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
                // res.send("Download Succeeded...")
                res.redirect(`/result?result=success`)

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
                // res.send("Download Succeeded...")
                res.redirect(`/result?result=success`)

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
                // res.send("Download Succeeded...");
                res.redirect(`/result?result=success`)

            } else if (selective_download_task && lost_pages.length < PAGES.length && lost_pages.length != 0) {
                DownloadSelectNormalPattern(res, lost_pages, total_imgs_num, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);

            } else if (selective_download_task && lost_pages.length == PAGES.length) {
                all_download_task = false;
                // res.send("Download Failed...");
                res.redirect(`/result?result=failed`)
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


module.exports = { getLanding, downloadAllPost, pdfing };