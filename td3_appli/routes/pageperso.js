var express = require('express');
var router = express.Router();
const Adhermodel = require('../model/DemandeAdherRecruteur')
const Orgamodel = require('../model/Organisation')

/* GET home page. */

module.exports = router;

router.get('/', function(req, res, next) {
    const pageData = { 
        title: 'Page personnelle',
        user: {
            id: req.session.userid,
            nom : req.session.name,
            prenom: req.session.firstname,
            tel: req.session.tel,
            mail: req.session.mail,
            mdp : req.session.mdp,
            creationDate : req.session.creationDate,
            role : req.session.role,
            statut: req.session.statut
        },
        isPagePerso: true
    };
    if (req.session.userid) {
        if (req.session.role === 'recruteur' || req.session.role === 'administrateur') {
            Adhermodel.getOrgaDuRecruteur(req.session.userid, (results) => {
                const orga = results[0];
                pageData.organisation = orga;
                pageData.user.orga = orga?.nom ? orga.nom + " (SIREN : " + orga.siren + ")" : "Aucune organisation";
                // pageperso.ejs a été supprimée, detailutilisateur.ejs a été adaptée pour récupérer les fonctionnalités de cette vue
                res.render('detailutilisateur', pageData);
            });
        } else {
            // Passer les données de l'utilisateur à la vue
            res.render('detailutilisateur', pageData);
        }
    } else {
        res.redirect('/connexion');
    }
});

router.get('/user-info', function(req, res, next) {
    if (req.session.userid) {
        // Create a user object with the required information
        const user = {
            id: req.session.userid, // Ajoutez cette ligne pour inclure l'ID de l'utilisateur
            nom: req.session.name,
            prenom: req.session.firstname,
            tel: req.session.tel,
            mail: req.session.mail,
            mdp: req.session.mdp,
            creationDate: req.session.creationDate,
            role: req.session.role,
            statut: req.session.statut
        };

        // Send the user object as the response
        res.json(user);
    } else {
        // If the user is not authenticated, send an appropriate response
        res.status(401).json({ message: 'Unauthorized' });
    }
});

router.get('/deconnexion', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Unable to log out');
        } else {
            res.redirect('/'); // Rediriger vers la page d'accueil ou la page de connexion
        }
    });
});