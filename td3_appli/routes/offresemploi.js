var express = require('express');
var router = express.Router();
var OffreEmploimodel = require('../model/OffreEmploi')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/offresemploilist', function (req, res, next) {
  result=OffreEmploimodel.readall(function(result){
  res.render('offresemploi', { title: 'Liste des offres d\'emploi', OffresEmploi: result });
  });
});

  



var Candidaturemodel= require('../model/Candidature')
router.post('/addCandidature', function(req, res, next) {
  if (req.session.userid) {
    Candidaturemodel.read(req.session.userid, function(result) {
      // Check if the user has already applied for this job offer
      const alreadyApplied = result.some(cand => cand.offreEmploi === req.body.offreEmploi);

      if (alreadyApplied) {
        return res.status(500).json({ error: "Vous ne pouvez pas candidater deux fois à la même candidature" });
      }

      // If no duplicate found, proceed to create the candidature
      const offreEmploi = req.body.offreEmploi;
      const candidat = req.session.userid;
      const date = req.body.date;
      const pieces = req.body.piecesChemAcces;
      const etat = req.body.etat;

      Candidaturemodel.create(offreEmploi, candidat, date, pieces, etat, function(success, err) {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'enregistrement de la candidature" });
        } else {
          res.json({ message: "Candidature insérée avec succès" });
        }
      });
    });
  } else {
    res.redirect('/connexion'); // Redirect the user to the login page
  }
});


module.exports = router;

