var express = require('express');
var router = express.Router();
var Adhermodel = require('../model/DemandeAdherRecruteur')
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

module.exports = router;
