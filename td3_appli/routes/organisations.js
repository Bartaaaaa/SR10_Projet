const express = require('express');
const organisationModel = require('../model/Organisation');
const typeOrgamodel= require('../model/TypeOrga');
const AdherenceModel = require('../model/DemandeAdherRecruteur');

const router = express.Router();

function transformtype(result, callback){
  typeOrgamodel.readall(function(resultOrga){
    // Créer une carte des types pour faciliter la correspondance
    const typeMap = new Map();
    for (const orga of resultOrga) {
      typeMap.set(orga.id, orga.nom);
    }
    const updatedOrganisations = result.map(org => (
      {...org, 
      type: typeMap.get(org.type) || org.type,
      typeList: Object.fromEntries(typeMap.entries()) // Ajout de l'ensemble des types à l'organisation pour affichage dans des select
    }))// Utilisation de la carte pour récupérer le nom du type
    callback(updatedOrganisations);
  });
};


router.get('/organisationslist', function (req, res, next) {
  // Lecture de toutes les organisations
  organisationModel.readall(function(result){
    // Mise à jour des organisations avec le nom du type au lieu de l'ID du type
    transformtype(result, function(result) {
      // Rendu de la vue avec les organisations mises à jour
      res.render('organisationsList', { title: 'Liste des organisations', organisations: result});
    });
  });
});
  
router.get('/readTypes', (req, res) => {
  typeOrgamodel.readallTypes(function(err, results) {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la récupération des types d'organisation" });
    }
    // Formater les résultats pour avoir une liste d'objets { id, nom }
    const types = results.map(row => ({
      id: row.id,
      nom: row.nom
    }));
    res.json(types);
  });
});

  router.post('/addtype', function (req, res, next) {
    const { nomType } = req.body;
  
    // Vérifiez si le type d'organisation existe déjà
    typeOrgamodel.readall(function (resultOrga) {
  
      // Cherchez le type dans les résultats
      let type = resultOrga.find(orga => orga.nom === nomType);
      let typeId = type ? type.id : null;
  
      if (typeId) {
        // Si le type existe déjà, retournez l'ID
        return res.json({ typeId });
      }
  
      // Si le type n'existe pas, créez-le et utilisez le nouvel ID
      typeOrgamodel.create(nomType, function (success, newId) {
        if (success) {
          res.json({ message: "Type inserted successfully", typeId: newId });
        } else {
          console.log("Failed to insert type.");
          res.status(500).json({ error: "Failed to insert type" });
        }
      });
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
  
  
  router.get('/detailsCreationOrganisation', function (req, res, next) {
    // Lecture de tous les types d'organisation
   
      // Lecture de toutes les organisations
      organisationModel.readall(function(result){
        // Mise à jour des organisations avec le nom du type au lieu de l'ID du type
        transformtype(result, function(result) {
          // Rendu de la vue avec les organisations mises à jour
          res.render('detailsCreationOrganisation', { title: 'Liste des organisations', organisations: result});
        });
      });
    });
// faut que lorsqu'un utilsateur ajoute une organisation de type "test", le code doit vérifier si ce type existe déjà , si oui il creat l'organisation avec la valeur 
//integer type associé, sinon il créer d'abord le type d'organisation correspondant, puis ajoute l'organisation

router.get('/:siren', (req, res) => {
  const siren = req.params.siren;
  const connectedUserId = req.session.userid;
  const role = req.session.role;

  organisationModel.read(siren, (err, result) => {
    if (err) throw err;
    if (result && connectedUserId) {
      transformtype([result], (organisationTable) => {
        const organisation = organisationTable[0];
        AdherenceModel.getOrgaDuRecruteur(connectedUserId, (resultOrga) => {
          const orga = resultOrga[0];
          let isAdminOrWorkingThere = false;
          if (String(orga?.siren) === String(siren) || role === "administrateur") {
            isAdminOrWorkingThere = true;
          }
          res.render('detailOrganisation', {
            title: "Détail organisation",
            organisation: organisation,
            isAdminOrWorkingThere: isAdminOrWorkingThere
          });
        });
      });
    } else {
      res.status(404).json({ error: "Organisation not found or user not logged in" });
    }
  });
});

router.post('/updateOrga', (req, res) => {

});
  
module.exports = router;
