const express = require('express');
const router = express.Router();
const Adhermodel = require('../model/DemandeAdherRecruteur')
const Orgamodel = require('../model/Organisation')

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
router.post('/readOrgaFromUser', function(req, res, next) {
    const { userId } = req.body;

    // Lire les informations de l'utilisateur
    Adhermodel.readUser(userId, function(err, user) {
        if (err || !user) {
            console.log("Erreur lors de la lecture de l'utilisateur:", err);
            return res.status(500).json({ success: false, error: "Failed to read user" });
        }
        if (user.etat !== "validee") {
            console.log("L'utilisateur n'est pas validé:", err);
            return res.status(500).json({ success: false, error: "Failed to read user" });
        }

        res.json({ success: true, result: user });
    });
});


/*router.get('/adherenceslist', function (req, res, next) {
    Adhermodel.readall(function(result){
        res.render('adherencesList', { title: 'Liste des adhérences', adherences: result });
    });
});*/

router.get('/adherenceslist/:organisationId', function (req, res, next) {
    const organisationId = req.params.organisationId;

    Adhermodel.read(organisationId, function(result) {
        res.render('adherencesList', { title: 'Liste des adhérences', adherences: result });
    });
});

router.post('/updateAdherence', function (req, res, next) {
    const { organisation, recruteur, etat } = req.body;

    if (!organisation || !recruteur || !etat) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    Adhermodel.update(organisation, recruteur, etat, function (success) {
        if (success) {
            res.json({ success: true, message: 'Adherence updated successfully.' });
        } else {
            res.status(500).json({ success: false, message: 'Error updating adherence.' });
        }
    });
});




module.exports = router;
