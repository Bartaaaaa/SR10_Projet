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

  router.post('/addorganisation', async function (req, res, next) {
    try {
      const { nom, siren, adrSiegeSocial: adresse, type: nomType } = req.body;
  
      // Lecture de tous les types d'organisation et création d'une map nom/id
      const types = await new Promise((resolve, reject) => {
        typeOrgamodel.readall(function(resultOrga) {
          if (resultOrga) {
            const typeMapNomtoId = new Map();
            for (const orga of resultOrga) {
              typeMapNomtoId.set(orga.nom, orga.id);
            }
            resolve(typeMapNomtoId);
          } else {
            reject("Failed to load types");
          }
        });
      });
  
      let typeId = types.get(nomType);
      if (!typeId) {
        // Si le type n'existe pas, créez-le et utilisez le nouvel ID
        typeId = await new Promise((resolve, reject) => {
          typeOrgamodel.create(nomType, function(success, newId) {  // Assurez-vous que la fonction create retourne un nouvel ID
            if (success) {
              resolve(newId);
            } else {
              reject("Failed to create new type");
            }
          });
        });
      }
  
      // Création de l'organisation avec le typeId résolu
      const insertResult = await new Promise((resolve, reject) => {
        organisationModel.creat(siren, nom, adresse, typeId, function(success) {
          if (success) {
            resolve({ message: "Organisation inserted successfully" });
          } else {
            reject({ error: "Failed to insert organisation" });
          }
        });
      });
  
      res.json(insertResult);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: "Server error" });
    }
  });
  

// faut que lorsqu'un utilsateur ajoute une organisation de type "test", le code doit vérifier si ce type existe déjà , si oui il creat l'organisation avec la valeur 
//integer type associé, sinon il créer d'abord le type d'organisation correspondant, puis ajoute l'organisation

  
module.exports = router;
