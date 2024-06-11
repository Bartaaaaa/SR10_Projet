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

  
module.exports = router;
