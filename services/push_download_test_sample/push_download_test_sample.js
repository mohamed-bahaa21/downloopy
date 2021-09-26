const fs = require('fs')
const path = require('path')

function addNewSampleToFile(newObj) {
    console.log("Started");

    const testsFile = `${__dirname}/../../tests/samples/download.test.json`;

    fs.readFile(testsFile, { encoding: 'UTF-8', flag: 'r' }, (err, data) => {
        if (err) { console.error("ERROR: ", err); }

        let oldTestArr = data;
        let oldTestArrParsed = JSON.parse(oldTestArr);
        let testArrStringified = JSON.stringify(oldTestArr);

        // console.log("Old_Test_Array: ", oldTestArrParsed);
        // console.log("New_Object: ", newObj);

        oldTestArrParsed.push(newObj);
        let newArr = oldTestArrParsed;
        testArrStringified = JSON.stringify(newArr);

        // console.log("New_Arr: ", newArr);
        // console.log(testArrStringified);

        fs.writeFile(testsFile, testArrStringified, err => {
            if (err) {
                console.error(err)
                return
            }
            console.log("Added sample to the file successfully...");
            //file written successfully
        })
    })
}

// addObjectToArray(testArrParsed, newObj)

module.exports = addNewSampleToFile;