const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const FileDownload = require("js-file-download");

const app = express();
const bookLink =
  "http://imageservice.qnl.qa/adore-djatoka/resolver?rft_id=http%3A%2F%2Fediscovery.qnl.qa%2Far%2Fislandora%2Fobject%2FQNL%253A00033926-0001%2Fdatastream%2FJP2%2Fview&url_ver=Z39.88-2004&svc_id=info%3Alanl-repo%2Fsvc%2FgetRegion&svc_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajpeg2000&svc.format=image%2Fjpeg&svc.level=4&svc.rotate=0";

app.use(bodyParser.json());

// // Make a request for qnl to get book page
// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getBookPage() {
  try {
    const response = await axios.get(
      "http://imageservice.qnl.qa/adore-djatoka/resolver?rft_id=http%3A%2F%2Fediscovery.qnl.qa%2Far%2Fislandora%2Fobject%2FQNL%253A00033926-0001%2Fdatastream%2FJP2%2Fview&url_ver=Z39.88-2004&svc_id=info%3Alanl-repo%2Fsvc%2FgetRegion&svc_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajpeg2000&svc.format=image%2Fjpeg&svc.level=4&svc.rotate=0"
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

app.get("/", (req, res) => {
    getBookPage();
    res.send("Completed")
});

app.listen(3000, console.log("Server: 3000"));

// try {
//     const response = await axios.get(`${bookLink}`);
//     FileDownload(response, 'page.jpeg');
//     res.send("Download Completed")
//     // console.log(response);
//   } catch (error) {
//     console.error(error);
//   }

// example page link
// const link = {
//     "resolver? rft_id=http3A2F2Fediscovery.qnl.qa2Far2Fislandora2Fobject2FQNL253A00033926-00012Fdatastream2FJP22Fview \n",
//     "&url_ver=Z39.88-2004 &svc_id=info%3Alanl-repo%2Fsvc%2FgetRegion &svc_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajpeg2000 &svc.format=image%2Fjpeg&svc.level=4&svc.rotate=0"
// }

// // Make a request for qnl to get book page
// axios
//   .get("/user?ID=12345")
//   .then(function (response) {
//     // handle success
//     console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .finally(function () {
//     // always executed
//   });

// // Optionally the request above could also be done as
// axios
//   .get("/user", {
//     params: {
//       ID: 12345,
//     },
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .finally(function () {
//     // always executed
//   });
