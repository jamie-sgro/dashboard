var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('ui');
  //res.render('index', { title: 'Express' });
});

/* GET User Interface page. */
router.get('/ui/', (req, res) => {
  res.render('ui');
  //res.render('index', { title: 'Express' });
  return;
});

module.exports = router;
