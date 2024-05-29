var express = require('express');
var router = express.Router();
var candidatureModel = require('../model/Candidature')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;




router.get('/mescandidatures', function (req, res, next) {
  if (req.session.userid) {

  candidatureModel.read(req.session.userid, function(result) {
      res.render('candidatures', { title: 'Liste de mes candidatures', candidatures: result });
  });
}
else{
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
