const express = require('express');
const fichesPosteModel = require('../model/FichePoste')
const router = express.Router();
const darModel = require('../model/DemandeAdherRecruteur');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/fichesposteliste', function (req, res, next) {
  fichesPosteModel.readAllInfo(function(result){
    const {userid, role} = req.session;
    console.log(`userid: ${userid}, role: ${role}`);
    // filtre en fonction de l'orga
    if (role === "recruteur") {
      darModel.getOrgaDuRecruteur(userid, (orgaResult) => {
        if (orgaResult.length !== 0) {
          const orga = orgaResult[0];
          result = result.filter(offre => offre.organisation_siren === orga.siren);
          console.log('filtré');
          return res.render('fichesPosteListe', { title: 'Liste des fiches de poste', fichesPoste: result, isRecruteur: true });
        }
      })
    } else {
      console.log('pas filtré');
      res.render('fichesPosteListe', { title: 'Liste des fiches de poste', fichesPoste: result, isRecruteur: false });
    }
  });
});


router.get('/detailsCreationFiche', function (req, res, next) {
  // Lecture de tous les types d'organisation
 
    // Lecture de toutes les organisations
      // Mise à jour des organisations avec le nom du type au lieu de l'ID du type
        // Rendu de la vue avec les organisations mises à jour
        res.render('detailsCreationFiche', { title: 'Liste des organisations'});
  });

  const metierModel = require('../model/Metier')

  router.get('/readMetier', (req, res) => {
    metierModel.readall(function(err, results) {
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


const StatutPosteModel= require('../model/StatutPoste')

router.get('/readStatutPoste', (req, res) => {
  StatutPosteModel.readall(function(err, results) {
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


module.exports = router;
