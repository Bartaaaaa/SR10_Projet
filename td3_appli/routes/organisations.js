const express = require('express');
const organisationModel = require('../model/Organisation')
const typeOrgamodel= require('../model/TypeOrga')

const router = express.Router();

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


  router.post('/addtype', function (req, res, next) {
    const { nomType } = req.body;
  
    // Vérifiez si le type d'organisation existe déjà
    typeOrgamodel.readall(function(resultOrga) {
  
      // Cherchez le type dans les résultats
      let type = resultOrga.find(orga => orga.nom === nomType);
      let typeId = type ? type.id : null;
  
      if (typeId) {
        // Si le type existe déjà, retournez l'ID
        return res.json({ typeId });
      }
  
      // Si le type n'existe pas, créez-le et utilisez le nouvel ID
      typeOrgamodel.create(nomType, function(success, newId) {
        if (success) {
          res.json({ message: "Type inserted successfully" });
        } else {
          console.log("Failed to insert user.");
          res.status(500).json({ error: "Failed to insert user" });
        }
      });
      res.json({ message: "Type inserted successfully" });

    });
  });
  router.post('/addorganisation', async function (req, res, next) {
    try {
      const { nom, siren, adrSiegeSocial: adresse, typeId } = req.body;
  
      // Création de l'organisation avec le typeId fourni
      const insertResult = await new Promise((resolve, reject) => {
        organisationModel.create(siren, nom, adresse, typeId, function(success) {
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
