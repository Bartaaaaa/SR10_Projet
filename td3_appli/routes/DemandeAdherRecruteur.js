var express = require('express');
var router = express.Router();
var Adhermodel = require('../model/DemandeAdherRecruteur')
var Orgamodel = require('../model/Organisation')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addAdherence', function(req, res, next) {
    const { siren, userId} = req.body;

    // Créez le type d'organisation
    Adhermodel.create(siren,userId, function(success, newId) {
        if (success) {
            res.json({ success : true , message: "Votre adhérence à l'organisation a été soumise." });
        } else {
            console.log("Failed to insert type.");
            res.status(500).json({ error: "Failed to insert type" });
        }
    });
});
router.post('/readOrga', function(req, res, next) {
    const { userId } = req.body;
    

    // Lire les informations de l'utilisateur
    Adhermodel.readUser(userId, function(err, user) {
        if (err || !user) {
            console.log("Erreur lors de la lecture de l'utilisateur:", err);
            return res.status(500).json({ success: false, error: "Failed to read user" });
        }
        if(user.etat!=="validee"){
        console.log("Erreur lors de la lecture de l'utilisateur:", err);
        return res.status(500).json({ success: false, error: "Failed to read user" });
         }

        // Lire les informations de l'organisation
        Orgamodel.read(user.organisation, function(err, organisation) {
            if (err || !organisation) {
                console.log("Erreur lors de la lecture de l'organisation:", err);
                return res.status(500).json({ success: false, error: "Failed to read organisation" });
            }
            
            console.log("Organisation lue:", organisation);
            res.json({ success: true, result: organisation });
        });
    });
});



module.exports = router;
