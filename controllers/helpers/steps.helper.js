const Parser = require('../../bin/url_parser/url-parser');

// 1. Choose System
// 2. URL Parser
// 3. Path Parser
// 4. Input Parser
// 5. Result

// 1/5
getChooseSys = (req, res, next) => {
    res.render("1_choose_sys", {
        // msgs: req.flash('success'),
        mixed: false,
        step: 1
    })
};

// 2/5
urlParser = (req, res, next) => {
    // let DTYPE =  req.body.DTYPE;
    // res.send(pages_arr);

    switch (req.body.DTYPE) {
        case 'mixed':
            var result;
            var FILES_NUMBER;

            try {
                result = Parser.parseURL(req.body.url);
                FILES_NUMBER = Number(req.body.FILES_NUMBER);
            } catch (error) {
                res.redirect('/')
            }

            req.session.origin = result.origin;
            req.session.FILES_NUMBER = FILES_NUMBER;
            console.log(`FILES_NUMBER: ${FILES_NUMBER}`);
            console.log(result);
            break;

        case 'selective':

            var result;
            var FILES_NUMBER;
            var pages_arr = req.body.pages_arr;

            try {
                result = Parser.parseURL(req.body.url);
                pages_arr = pages_arr.split(',').map(Number);
                FILES_NUMBER = pages_arr.length
            } catch (error) {
                res.redirect('/')
            }

            req.session.origin = result.origin;
            req.session.FILES_NUMBER = FILES_NUMBER;
            req.session.pages_arr = pages_arr;
            console.log(`pages_arr: ${pages_arr}`);
            console.log(`FILES_NUMBER: ${FILES_NUMBER}`);
            break;
    }

    // res.send(req.body);
    res.render('2_url_parser', {
        pathArr: result.pathArr,
        step: 2
    });
}

// 3/5
pathParser = (req, res, next) => {
    console.log(req.session.pages_arr);
    let tmp_inputArr;
    let inputArr = [];

    try {
        tmp_inputArr = req.body.url_path;
    } catch (error) {
        res.redirect('/')
    }

    if (typeof tmp_inputArr == Array) {
        tmp_inputArr.map((ele) => {
            let tmp_ele = ele.split(' - ');
            inputArr.push({
                index: tmp_ele[0],
                text: tmp_ele[1]
            });

        })
    } else {
        let tmp_ele = tmp_inputArr.split(' - ');
        inputArr.push({
            index: tmp_ele[0],
            text: tmp_ele[1]
        });
    }
    // res.send(inputArr);

    req.session.pathArr = req.body.pathArr;

    res.render('3_path_parser', {
        pathArr: req.body.pathArr,
        inputArr: inputArr,
        step: 3
    });
}

// 4/5
inputParser = (req, res, next) => {
    // let { pathArr, inputs } = req.body;
    let { inputs } = req.body;
    let { pathArr, origin } = req.session;

    // console.log(`req.session.FILES_NUMBER: ${req.session.FILES_NUMBER}`);
    // req.session.pages_arr
    let urls;

    try {
        urls = Parser.generateNewUrls(origin, pathArr, inputs, req.session.FILES_NUMBER, req.session.pages_arr);
    } catch (error) {
        res.redirect('/')
    }
    req.session.urls = urls;

    res.render("4_input_parser", {
        mixed: true,
        urls: urls,
        step: 4
    });
}

// 5/5
getResult = (req, res, next) => {
    let result = req.query.result;

    res.render("5_result", {
        mixed: true,
        result: result,
        step: 5
    });
}

module.exports = { getChooseSys, urlParser, pathParser, inputParser, getResult };