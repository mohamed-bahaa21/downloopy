var needle = require('needle');
const fs = require('fs-extra');
PDFDocument = require('pdfkit');
const checkValue = require('../../bin/url_numbers_generator/zeros_pattern');

let { global_download_task, all_download_task, downloaded_pages } = require('./global.controller')
const { DownloadSelectMixedPattern, DownloadSelectPattern } = require('./downloadPatterns.helper')

// var global_download_task = false;
// var all_download_task = false;
// var downloaded_pages = [];

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
                DownloadSelectPattern(res, lost_pages, total_imgs_num, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
            }
        })

        needle.get(uri, (error, response) => {
            // #3
            console.log('==> #3');
            console.log(response.bytes)
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
                DownloadSelectPattern(res, lost_pages, lost_pages.length, URI_START, URI_END, total_dir, FILE_NAME, FILE_TYPE);
            }
        })

        needle.get(uri, (error, response) => {
            // #4
            console.log('==> #4');
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

function mixedNumbering(req, res, _urls, total_dir, FILE_NAME, FILE_TYPE, index = 1, lost_pages, result_table) {

    console.log(`index: ${index}`);
    if (index == 1) {
        downloaded_pages.length = 0;
        var lost_pages = [];
    }

    // FOR LOOP STARTS => zero pattern numbers
    // for (let index = 1; index <= _urls.length; index++) {
    const element = index;
    if (element == undefined) {
        mixedNumbering(req, res, _urls, total_dir, FILE_NAME, FILE_TYPE, index++, lost_pages, result_table);
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
                mixedNumbering(req, res, _urls, total_dir, FILE_NAME, FILE_TYPE, index, lost_pages, result_table);

            } else if (all_download_task && lost_pages.length == 0) {
                // res.send("Download Succeeded...")
                res.redirect(`/result?result=success`)

            } else if (all_download_task && lost_pages.length > 0) {
                console.log("HERE")
                res.redirect(`/result?result=failed`);
                // DownloadSelectMixedPattern(res, lost_pages, total_dir, FILE_NAME, FILE_TYPE);
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
                // #5
                console.log('==> #5');
                // console.log(response.bytes)

                if (!error && response.statusCode == 200) {
                    downloaded_pages.push(element);

                    // add result succeeded child 
                    result_table.addChild(`${FILE_NAME}-${element}.${FILE_TYPE}`, true, response.bytes);
                    console.log('====================================');
                    console.log(result_table);
                    console.log('====================================');
                    req.session.result_table = result_table;
                } else {
                    lost_pages.push({ uri, element });
                    // add result failed child 
                    result_table.addChild(`${FILE_NAME}-${element}.${FILE_TYPE}`, false, response.bytes);
                    console.log('====================================');
                    console.log(result_table);
                    console.log('====================================');
                    req.session.result_table = result_table;

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

module.exports = {
    cipherNumbering,
    normalNumbering,
    mixedNumbering
};