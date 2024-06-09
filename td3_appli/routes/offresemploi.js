const express = require('express');
const router = express.Router();
const OffreEmploimodel = require('../model/OffreEmploi')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/offresemploilist', function (req, res, next) {
  result=OffreEmploimodel.readall(function(result){
  res.render('offresemploi', { title: 'Liste des offres d\'emploi', OffresEmploi: result });
  });
});





module.exports = router;

