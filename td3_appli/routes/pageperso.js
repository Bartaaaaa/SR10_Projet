var express = require('express');
var router = express.Router();

/* GET home page. */

module.exports = router;

router.get('/', function(req, res, next) {
    if (req.session.userid) {
        // Passer les données de l'utilisateur à la vue
        res.render('pageperso', { 
            title: 'Page personnelle',
            user: {
                nom : req.session.name,
                prenom: req.session.firstname,
                tel: req.session.tel,
                mail: req.session.mail,
                mdp : req.session.mdp,
                creationDate : req.session.creationDate,
                role : req.session.role,
                statut: req.session.statut
            }
        });
    } else {
        res.redirect('/connexion');
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