var express = require('express');
var router = express.Router();
var candidatureModel = require('../model/Candidature');
const path = require('path'); // Import path module

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const Candidaturemodel = require('../model/Candidature');

// Route to display candidatures
router.get('/mescandidatures', function(req, res, next) {
  if (req.session.userid) {
    Candidaturemodel.read(req.session.userid, function(result) {
      if (result) {
        console.log('Candidatures récupérées:', result);

        // Process the candidatures to create an array of file objects
        result.forEach(candidature => {
          console.log('Traitement de la candidature:', candidature);

          candidature.piecesChemAcces = candidature.piecesChemAcces.split(',').map(file => {
            const filePath = `/uploads/${path.basename(file)}`;
            console.log('Chemin du fichier:', filePath);
            return {
              filePath: filePath,
              fileName: path.basename(file)
            };
          });

          console.log('Pièces jointes traitées:', candidature.piecesChemAcces);
        });
      }
      res.render('candidatures', {
        title: 'Liste de mes candidatures',
        candidatures: result, // Ensure this matches the EJS template variable
        path: path // Pass the path module to the view
      });
    });
  } else {
    res.redirect('/connexion');
  }
});

router.post('/deletecandidature', function (req, res) {
  const offreEmploi = req.body.offreEmploi;  // Ensure the variables are declared correctly
  const candidat = req.body.candidat;

  candidatureModel.delete(offreEmploi, candidat, function(success) {
    if (success) {
      console.log("Candidature deleted successfully!");
      res.json({ success: true, message: "Candidature deleted successfully" });
    } else {
      console.log("Failed to delete Candidature.");
      res.status(500).json({ error: "Failed to delete Candidature" });
    }
  });
});

module.exports = router;
