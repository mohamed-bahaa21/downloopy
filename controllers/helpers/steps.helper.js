const Parser = require('../../bin/url_parser/url-parser');

// 1. Choose System
// 2. URL Parser
// 3. Path Parser
// 4. Input Parser
// 5. Result

// 1/5
getChooseSys = (req, res, next) => {
    req.session.origin = undefined;
    req.session.FILES_NUMBER = undefined;
    req.session.pages_arr = undefined;
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
    // res.send(req.body);

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
    // console.log(req.session.pages_arr);
    let tmp_inputArr;
    let inputArr = [];

    try {
        tmp_inputArr = req.body.url_path;
    } catch (error) {
        res.redirect('/')
    }

    // res.send({tmp_inputArr, type: typeof tmp_inputArr, length: tmp_inputArr.length});
    if (tmp_inputArr.length > 1 && (typeof tmp_inputArr) == 'object') {
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
        console.log('arr ', req.session.pages_arr);
        urls = Parser.generateNewUrls(origin, pathArr, inputs, req.session.FILES_NUMBER, req.session.pages_arr);
    } catch (error) {
        // res.send(req.session)
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
    let status = req.query.result;
    // try {
    //     console.log('====================================');
    //     console.log(req.session.result_table.nodes);
    //     console.log('====================================');
    //     var result_table = req.session.result_table.nodes;
    // } catch (error) {
    //     res.redirect('/');
    // }

    // Test Adding samplees to result class
    let ResultTable = require('./ResultTable');
    let result_table = new ResultTable();
    result_table.addChild('lecture-1', true, 945020)
    result_table.addChild('lecture-2', true, 15020)
    result_table.addChild('lecture-3', true, 24020)
    result_table.addChild('lecture-4', false, 0)
    result_table.addChild('lecture-5', true, 7520)

    // res.send(result_table)

    res.render("5_result", {
        mixed: true,
        result: result_table.nodes,
        status: status,
        step: 5
    });
}

module.exports = { getChooseSys, urlParser, pathParser, inputParser, getResult };