const express = require('express');
const router = express.Router();
const OffreEmploimodel = require('../model/OffreEmploi')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/readdetailsoffre', function (req, res, next) {
  result=fichesPosteModel.readall(function(result){
  res.render('AMODIFIER', { title: 'AMODIFIER', fichesPoste: result });
  });
});


//////////// POUR AFFICHER LA PAGE DETAILS OFFRE //////////// 
router.get('/:id', function (req, res) {
  const id = req.params.id // récupérer l'id dans l'URL
  OffreEmploimodel.readAllInfo(id, function(results){ // récupérer toutes les informations liées à une offre
    const offre = results[0];

    if (offre !== undefined){
      offre.intitule = offre.statutPoste_nom + " - " + offre.metier_nom + " chez " + offre.organisation_nom;
      offre.remuneration = offre.salaireMin + " - " + offre.salaireMax + " brut/mois";
      
      // formatage de la date de Validité
      const dateVal = new Date(offre.dateValidite);
      const jour = String(dateVal.getDate()).padStart(2, '0'); // padStart permet d'avoir 2 chiffres pour le jour
      const mois = String(dateVal.getMonth() + 1).padStart(2, '0'); // janvier = 0 ici, donc +1
      const an = dateVal.getFullYear();
      offre.dateValidite = `${jour}/${mois}/${an}`;
      res.render('detailsoffre', {offer: offre});  // {varVue : varLocale}

    } else {
      res.status(404).json({ error: "Offer not found" });
    }
  })
 
});





////////////  AJOUTER UNE CANDIDATURE A UNE OFFRE D'EMPLOI ////////////  -->  GESTION DES FICHIERS A FAIRE
const multer = require('multer');
const upload = multer({dest: '../user_uploads'}); // Import multer configuration

var Candidaturemodel= require('../model/Candidature')
//upload.array('fileUpload', 10) : C'est un middleware multer qui gère le téléchargement de fichiers. Il permet de télécharger jusqu'à 10 fichiers à la fois, provenant du champ de formulaire fileUpload.
//upload.array('fileUpload', 10) : Ce middleware traite les fichiers envoyés sous le champ fileUpload et les enregistre dans le répertoire uploads selon la configuration définie.


// Ajouter une candidature à une offre d'emploi
router.post('/addCandidature', upload.array('fileUpload', 10), function(req, res, next) {
  console.log(req.session);

  // (Manon) marche pas, jsp pq
  if (req.session.userid === undefined || req.session.userid === null) {
    res.redirect('/connexion'); // on sort 
  }
  
  //// Vérifier que l'utilisateur n'ait pas encore candidaté ////
  Candidaturemodel.getAllCandidaturesFromCandidat(req.session.userid, function(result) { // récupération 
    const alreadyApplied = result.some(cand => cand.offreEmploi === req.body.idOffreEmploi);  // .some() teste si au moins un élément du tableau passe le test implémenté par la fonction fournie.
    if (alreadyApplied) {
      return res.status(500).json({ error: "Vous ne pouvez pas candidater deux fois à la même offre" });
    }


    
    //// Vérifier que le bon nombre de pièces jointes ait été téléversé ////
    OffreEmploimodel.read(req.body.idOffreEmploi, function(result){ // renvoie un array
      const offre = result[0];

      const nbPiecesEnvoyees = req.files.length;  // Multer passe les fichiers dans req.files
      if (offre.nbPieces !== nbPiecesEnvoyees){
        return res.status(500).json({ error: "Vous n'avez pas entré le nombre de pièces jointes spécifié" });
      }
      

      //// création de la candidature ////
      const offreEmploi = req.body.idOffreEmploi;
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
  });

  // (Manon: pourquoi pas de res.send ?)
});

  
module.exports = router;
