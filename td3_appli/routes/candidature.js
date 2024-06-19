const express = require('express');
const router = express.Router();
const path = require('path'); // Import path module
const fs = require('fs'); // Import fs module

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const Candidaturemodel = require('../model/Candidature');
const userModel = require('../model/Utilisateur');

// Route to display candidatures
router.get('/mescandidatures/:id', function(req, res, next) {
  const id = req.params.id;
  if (req.session.userid) {
    Candidaturemodel.getAllCandidaturesFromCandidat(id, function(result) {
      if (result) {
        console.log('Candidatures récupérées:', result);

        // Process the candidatures to create an array of file objects
        result.forEach(candidature => {

          const dateCrea = new Date(candidature.date);
          const jour = String(dateCrea.getDate()).padStart(2, '0'); // padStart permet d'avoir 2 chiffres pour le jour
          const mois = String(dateCrea.getMonth() + 1).padStart(2, '0'); // janvier = 0 ici, donc +1
          const an = dateCrea.getFullYear();
          candidature.date = `${jour}/${mois}/${an}`;
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

      userModel.readId(id, (userResult) => {
        const user = userResult[0];
        res.render('candidatures', {
          title: `Liste des candidatures de ${user.nom} ${user.prenom}`,
          candidatures: result, // Ensure this matches the EJS template variable
          path: path // Pass the path module to the view
        });
      });
    });
  } else {
    res.redirect('/connexion');
  }
});

router.post('/deletecandidature', function (req, res) {
  const offreEmploi = req.body.offreEmploi;
  const candidat = req.body.candidat;

  // Lire la candidature pour obtenir les chemins des fichiers
  candidatureModel.readOne(offreEmploi, candidat, function(candidature) {
    if (candidature) {
      const filesToDelete = candidature.piecesChemAcces.split(',');

      // Supprimer les fichiers
      filesToDelete.forEach(filePath => {
        const fullPath = path.join(__dirname, '../uploads', path.basename(filePath));
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error('Erreur lors de la suppression du fichier:', fullPath, err);
          } else {
            console.log('Fichier supprimé:', fullPath);
          }
        });
      });

      // Supprimer la candidature de la base de données
      candidatureModel.delete(offreEmploi, candidat, function(success) {
        if (success) {
          console.log("Candidature supprimée avec succès!");
          res.json({ success: true, message: "Candidature supprimée avec succès" });
        } else {
          console.log("Échec de la suppression de la candidature.");
          res.status(500).json({ error: "Échec de la suppression de la candidature" });
        }
      });
    } else {
      res.status(404).json({ error: "Candidature non trouvée" });
    }
  });
});

module.exports = router;
