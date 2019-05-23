var express = require('express');
var router = express.Router();

var getData = require("./getData")

//GET home page.
router.get('/', (req, res)=> {
  console.log("get: '/'")

  // TEMP:
  var fs = require("fs")
  var data = fs.readFileSync("./public/ui/sdsn_cleaned.csv");

  console.log(data)

  res.render('index');
});

//GET User Interface page.
router.get('/ui/', (req, res) => {
  console.log("get: '/ui/'")
  res.render('ui');
  //res.render('index', { title: 'Express' });
  return;
});

module.exports = router;
