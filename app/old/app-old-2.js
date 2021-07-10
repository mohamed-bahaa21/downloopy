const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const request = require("request");

const app = express();

let page_num = [
  "0001",
  "0002",
  "0003",
  "0004",
  "0005",
  "0006",
  "0007",
  "0008",
  "0009",

  "0010",
  "0011",
  "0012",
  "0013",
  "0014",
  "0015",
  "0016",
  "0017",
  "0018",
  "0019",

  "0020",
  "0021",
  "0022",
  "0023",
  "0024",
  "0025",
  "0026",
  "0027",
  "0028",
  "0029",

  "0030",
  "0031",
  "0032",
  "0033",
  "0034",
  "0035",
  "0036",
  "0037",
  "0038",
  "0039",

  "0040",
  "0041",
  "0042",
  "0043",
  "0044",
  "0045",
  "0046",
  "0047",
  "0048",
  "0049",

  "0050",
  "0051",
  "0052",
  "0053",
  "0054",
  "0055",
  "0056",
  "0057",
  "0058",
  "0059",

  "0060",
  "0061",
  "0062",
  "0063",
  "0064",
  "0065",
  "0066",
  "0067",
  "0068",
  "0069",

  "0070",
  "0071",
  "0072",
  "0073",
  "0074",
  "0075",
  "0076",
  "0077",
  "0078",
  "0079",

  "0080",
  "0081",
  "0082",
  "0083",
  "0084",
  "0085",
  "0086",
  "0087",
  "0088",
  "0089",

  "0090",
  "0091",
  "0092",
  "0093",
  "0094",
  "0095",
  "0096",
  "0097",
  "0098",
  "0099",

  "0100",
  "0101",
  "0102",
  "0103",
  "0104",
  "0105",
  "0106",
  "0107",
  "0108",
  "0109",

  "0110",
  "0111",
  "0112",
  "0113",
  "0114",
  "0115",
  "0116",
  "0117",
  "0118",
  "0119",

  "0120",
  "0121",
  "0122",
  "0123",
  "0124",
  "0125",
  "0126",
  "0127",
  "0128",
  "0129",

  "0130",
  "0131",
  "0132",
  "0133",
  "0134",
  "0135",
  "0136",
  "0137",
  "0138",
  "0139",

  "0140",
  "0141",
  "0142",
  "0143",
  "0144",
  "0145",
  "0146",
  "0147",
  "0148",
  "0149",

  "0150",
  "0151",
  "0152",
  "0153",
  "0154",
  "0155",
  "0156",
  "0157",
  "0158",
  "0159",

  "0160",
  "0161",
  "0162",
  "0163",
  "0164",
  "0165",
  "0166",
  "0167",
  "0168",
  "0169",

  "0170",
  "0171",
  "0172",
  "0173",
  "0174",
  "0175",
  "0176",
  "0177",
  "0178",
  "0179",

  "0180",
  "0181",
  "0182",
  "0183",
  "0184",
  "0185",
  "0186",
  "0187",
  "0188",
  "0189",
];
const bookLink = `http://imageservice.qnl.qa/adore-djatoka/resolver?rft_id=http%3A%2F%2Fediscovery.qnl.qa%2Far%2Fislandora%2Fobject%2FQNL%253A00033926-${page_num}%2Fdatastream%2FJP2%2Fview&url_ver=Z39.88-2004&svc_id=info%3Alanl-repo%2Fsvc%2FgetRegion&svc_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajpeg2000&svc.format=image%2Fjpeg&svc.level=4&svc.rotate=0`;
// console.log(page_num);

app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json());

const download = (uri, filename, callback) => {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

app.get("/", (req, res) => {
  res.send(`
    <h3>Completed...</h3> \n 
    <form action="/" method="post">
        <input type="number" name="fpage" id="fpage">
        <input type="submit" value="Submit">
    </form>
    `);
});

app.post("/", async (req, res) => {
  let { fpage } = req.body;
  console.log(fpage);

  for (var i = fpage; i <= fpage + 10 - 1; i++) {
    const response = await download(
      `http://imageservice.qnl.qa/adore-djatoka/resolver?rft_id=http%3A%2F%2Fediscovery.qnl.qa%2Far%2Fislandora%2Fobject%2FQNL%253A00033926-${page_num[i]}%2Fdatastream%2FJP2%2Fview&url_ver=Z39.88-2004&svc_id=info%3Alanl-repo%2Fsvc%2FgetRegion&svc_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajpeg2000&svc.format=image%2Fjpeg&svc.level=4&svc.rotate=0`,
      `book/page_${page_num[i]}.jpeg`,
      () => {
        console.log(`done ${page_num[i]}`);
      }
    );
    console.log(response);    
  }
});

app.listen(3000, console.log("Server: 3000"));
