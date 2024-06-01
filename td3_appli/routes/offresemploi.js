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

  


const upload = require('../config/multer-config'); // Import multer configuration

var Candidaturemodel= require('../model/Candidature')
//upload.array('fileUpload', 10) : C'est un middleware multer qui gère le téléchargement de fichiers. Il permet de télécharger jusqu'à 10 fichiers à la fois, provenant du champ de formulaire fileUpload.
//upload.array('fileUpload', 10) : Ce middleware traite les fichiers envoyés sous le champ fileUpload et les enregistre dans le répertoire uploads selon la configuration définie.
router.post('/addCandidature', upload.array('fileUpload', 10), function(req, res, next) {
  if (req.session.userid) {
    Candidaturemodel.read(req.session.userid, function(result) {
      const alreadyApplied = result.some(cand => cand.offreEmploi === req.body.offreEmploi);

      if (alreadyApplied) {
        return res.status(500).json({ error: "Vous ne pouvez pas candidater deux fois à la même candidature" });
      }

      const offreEmploi = req.body.offreEmploi;
      const candidat = req.session.userid;
      const date = req.body.date;
      //const pieces = req.files.map(file => file.path); : Cette ligne crée un tableau des chemins des fichiers téléchargés. req.files est rempli par multer et contient des informations sur chaque fichier téléchargé.
      const pieces = req.files.map(file => file.path); // Array of file paths
      const etat = req.body.etat;
//pieces.join(',') : Convertit le tableau des chemins des fichiers en une chaîne de caractères séparée par des virgules.
      Candidaturemodel.create(offreEmploi, candidat, date, pieces.join(','), etat, function(success, err) {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'enregistrement de la candidature" });
        } else {
          res.json({ message: "Candidature insérée avec succès" });
        }
      });
    });
  } else {
    res.redirect('/connexion');
  }
});


module.exports = router;

