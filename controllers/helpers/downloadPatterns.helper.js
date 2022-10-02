const path = require("path");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
var needle = require('needle');
const fs = require('fs-extra')
PDFDocument = require('pdfkit');
const checkValue = require('../../bin/url_numbers_generator/zeros_pattern');
// Warning Here 
// TODO:: Solve the circular dependency
let { global_download_task, all_download_task, downloaded_pages } = require('./global.controller')
const { cipherNumbering, normalNumbering, mixedNumbering } = require('./numbering.helper')
let ResultTable = require('./ResultTable')

// var global_download_task = false;
// var all_download_task = false;

// var downloaded_pages = [];

function DownloadAllPattern(req, res, NTYPE, total_imgs_num, START_NUM, BASIS, FINISH_NUM, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
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
        let result_table = new ResultTable();
        mixedNumbering(req, res, total_imgs_num, total_dir, FILE_NAME, FILE_TYPE, 1, lost_pages, result_table);
    }

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
                // #1
                console.log('==> #1');
                console.log(response.bytes)
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

function DownloadSelectPattern(res, PAGES, total_imgs_num, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE) {
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
                DownloadSelectPattern(res, lost_pages, total_imgs_num, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);

            } else if (selective_download_task && lost_pages.length == PAGES.length) {
                all_download_task = false;
                // res.send("Download Failed...");
                res.redirect(`/result?result=failed`)
            }
        })

        needle.get(uri, function (error, response) {
            // #2
            console.log('==> #2');
            console.log(response.bytes)
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
module.exports = {
    DownloadAllPattern,
    DownloadSelectMixedPattern,
    DownloadSelectPattern
};