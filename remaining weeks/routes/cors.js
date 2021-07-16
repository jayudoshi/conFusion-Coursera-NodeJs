var cors = require('cors')

var allowlist = ['https://www.google.com', 'http://example2.com', 'http://MSI:3001','http://localhost:3001']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  console.log("Request For Cross-Origin")
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    console.log("Allowed For Cross-Origin")
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    console.log("Not Allowed For Cross-Origin")
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

module.exports.corsWithOption = cors(corsOptionsDelegate)
module.exports.cors = cors()