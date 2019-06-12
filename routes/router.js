var express = require('express');
var router = express.Router();
var papa = require("papaparse");
var getData = require("./getData")

//GET home page.
router.get('/', (req, res)=> {
  res.render('index');
});

//GET final page
router.get('/home', (req, res)=> {
  res.render('final-index');
});

//GET about page.
router.get('/about', (req, res)=> {
  res.render('about');
});

//GET User Interface page.
router.get('/ui/', (req, res) => {
  console.log("get: '/ui/'")
  res.render('ui');
  //res.render('index', { title: 'Express' });
  return;
});

//GET home page if nothing else matches.
router.get('*', (req, res)=> {
  res.redirect('final-index');
});

router.post('/getData', (req, res) => {
  var fs = require("fs")
  var rawData = fs.readFileSync("./public/data/sdsn_cleaned.csv", "utf8");

  var data = papa.parse(rawData, {
    header: true
  });

  res.status(200);
  res.send(data);
  return;
});

module.exports = router;
