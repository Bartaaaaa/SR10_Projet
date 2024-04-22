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


router.post('/addorganisation', function (req, res, next) {
  const nom = req.body.nom;
  const siren = req.body.siren;
  const adresse = req.body.adrSiegeSocial;
  const type = req.body.type;
  
  // Appel à la fonction create de userModel avec les données du formulaire
    result = organisationModel.readall(function(result) {
    res.render('organisationsList', { title: 'Liste des organisations', organisations: result });
});

      organisationModel.creat(siren, nom, adresse, type, function(success) {
      if (success) {
          console.log("User inserted successfully!");
      } else {
          console.log("Failed to insert user.");
      }
  });       
});

  
module.exports = router;
