var express = require('express');
var router = express.Router();
var userModel = require('../model/Utilisateur')

var sessionManager = require('../session');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('connexion', { title: 'Express' });
});



router.post('/connexion', (req, res) => {
  userModel.readall(function(result) {
    let userFound = false;
    for (let i = 0; i < result.length; i++) {
        const user = result[i];
        if (req.body.mail === user.mail && req.body.mdp === user.mdp) {
            console.log("User connected successfully!");
            userFound = true;
            // Créer la session utilisateur
            data = {id : user.id , mail : user.mail, mdp : user.mdp ,name : user.nom, firstname : user.prenom,  tel : user.tel, creationDate : user.dateCreation, statut: user.statut}
            sessionManager.creatSession(req.session, data, 'user');

            break; // Sortir de la boucle une fois qu'un utilisateur est trouvé
        }
    }
    if (userFound) {
        res.json({ success: true, message: "User connected successfully" });
    } else {
        console.log("Failed to connect user.");
        res.status(500).json({ error: "Failed to connect user" });
    }
  });
});
module.exports = router;

