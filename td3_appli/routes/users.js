var express = require('express');
var userModel = require('../model/Utilisateur')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/userslist', function (req, res, next) {
  result=userModel.readall(function(result){
  res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

  
module.exports = router;
