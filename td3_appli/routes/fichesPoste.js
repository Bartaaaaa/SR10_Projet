const express = require('express');
const fichesPosteModel = require('../model/FichePoste')
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/fichesposteliste', function (req, res, next) {
  result=fichesPosteModel.readall(function(result){
  res.render('fichesPosteListe', { title: 'Liste des fiches de poste', fichesPoste: result });
  });
});

  
module.exports = router;
