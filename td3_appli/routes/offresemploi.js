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
      const offreEmploi = req.body.offreEmploi;
      const candidat = req.session.userid;
      const date = req.body.date;
      const pieces = req.body.piecesChemAcces;
      const etat = req.body.etat;


      Candidaturemodel.create(offreEmploi, candidat, date, pieces, etat, function(success) {
          if (success) {
            res.json({ message: "Candidature inserted successfuly" });
          } else {
            
            res.status(500).json({ error: "Erreur lors de l'enregistrement de la candidature" });
          }
    });
  } else {
      res.redirect('/connexion'); // Redirige l'utilisateur vers la page de connexion
  }
  // (Manon: pourquoi pas de res.send ?)
});

module.exports = router;

