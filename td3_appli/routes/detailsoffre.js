var express = require('express');
var fichesPosteModel = require('../model/DetailsOffre')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/readdetailsoffre', function (req, res, next) {
  result=fichesPosteModel.readall(function(result){
  res.render('AMODIFIER', { title: 'AMODIFIER', fichesPoste: result });
  });
});

  
module.exports = router;
