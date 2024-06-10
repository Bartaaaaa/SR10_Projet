const express = require('express');
const router = express.Router();
const OffreEmploimodel = require('../model/OffreEmploi')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});








//////////// POUR AFFICHER LA PAGE LISTE DES OFFRES //////////// 

function TraitementOffre(offre){
  if (offre !== undefined){
    offre.intitule = offre.statutPoste_nom + " - " + offre.metier_nom + " chez " + offre.organisation_nom;
    offre.remuneration = offre.salaireMin + " - " + offre.salaireMax + "€ brut/mois";
    
    // formatage de la date de Validité
    const dateVal = new Date(offre.dateValidite);
    const jour = String(dateVal.getDate()).padStart(2, '0'); // padStart permet d'avoir 2 chiffres pour le jour
    const mois = String(dateVal.getMonth() + 1).padStart(2, '0'); // janvier = 0 ici, donc +1
    const an = dateVal.getFullYear();
    offre.dateValidite = `${jour}/${mois}/${an}`;
    return offre;
  }
}

router.get('/offresemploilist', function (req, res) {
  // récupérer toute ta liste
  OffreEmploimodel.readAllInfoOfAllOffers(function(results){ // récupérer toutes les informations liées à toutes les offres
    const allOffersInfo = results.map(offer => TraitementOffre(offer));
    res.render('offresemploi', {allOffers: allOffersInfo, title: "Offres d'emploi"});  
  });
});


 



module.exports = router;

