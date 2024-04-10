var express = require('express');
var organisationModel = require('../model/Organisation')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/organisationslist', function (req, res, next) {
  result=organisationModel.readall(function(result){
  res.render('organisationsList', { title: 'Liste des organisations', organisations: result });
  });
});

  
module.exports = router;
