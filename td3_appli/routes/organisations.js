var express = require('express');
var organisationModel = require('../model/Organisation')
var typeOrgamodel= require('../model/TypeOrga')

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

function transformtype(result,callback){
  typeOrgamodel.readall(function(resultOrga){
    // Créer une carte des types pour faciliter la correspondance
    const typeMap = new Map();
    for (const orga of resultOrga) {
      typeMap.set(orga.id, orga.nom);
    }
console.log(typeMap);
const updatedOrganisations = result.map(org => ({...org,type: typeMap.get(org.type) || org.type }))// Utilisation de la carte pour récupérer le nom du type
callback(updatedOrganisations);

  })};


router.get('/organisationslist', function (req, res, next) {
  // Lecture de tous les types d'organisation
 
    // Lecture de toutes les organisations
    organisationModel.readall(function(result){
      // Mise à jour des organisations avec le nom du type au lieu de l'ID du type
      transformtype(result, function(result) {
        // Rendu de la vue avec les organisations mises à jour
        res.render('organisationsList', { title: 'Liste des organisations', organisations: result});
      });
    });
  });



router.post('/addorganisation', function (req, res, next) {
  const nom = req.body.nom;
  const siren = req.body.siren;
  const adresse = req.body.adrSiegeSocial;
   type = req.body.type;

  // Appel à la fonction create de userModel avec les données du formulaire
  organisationModel.readall(function(result){
    // Mise à jour des organisations avec le nom du type au lieu de l'ID du type
    transformtype(result, function(result) {
      // Rendu de la vue avec les organisations mises à jour


      res.render('organisationsList', { title: 'Liste des organisations', organisations: result});
    });
  });

  const typeMapNomtoId = new Map();
  typeOrgamodel.readall(function(resultOrga){
    // Créer une carte des types pour faciliter la correspondance
    for (const orga of resultOrga) {
      typeMapNomtoId.set(orga.nom, orga.id);
    }
  console.log(typeMapNomtoId);
  type = typeMapNomtoId.get(type) || type;

console.log("Voici le type",type);

      organisationModel.creat(siren, nom, adresse, type, function(success) {
      if (success) {
          console.log("Organisation inserted successfully!");
      } else {
typeOrgamodel.create(type); 
organisationModel.creat(siren, nom, adresse, type);     }
});
  });       
});

// faut que lorsqu'un utilsateur ajoute une organisation de type "test", le code doit vérifier si ce type existe déjà , si oui il creat l'organisation avec la valeur 
//integer type associé, sinon il créer d'abord le type d'organisation correspondant, puis ajoute l'organisation

  
module.exports = router;
