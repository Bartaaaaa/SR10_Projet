var express = require('express');
var userModel = require('../model/Utilisateur')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/userslist', function (req, res, next) {
  result=userModel.readall(function(result){

  res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

//Ajouter un utilisateur 
//Ajouter un utilisateur 
router.post('/adduser', function (req, res, next) {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.mail;
  const telephone = req.body.tel;
  const motDePasse = req.body.mdp;
  //const dateNaissance = req.body.date;

  const currentDate = new Date();
// Extraire l'année, le mois et le jour de la date actuelle
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  // Appel à la fonction create de userModel avec les données du formulaire
  result = userModel.readall(function(result) {
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
});

if (email !== null) {
    userModel.areValid(email, function(isValid) {
        if (isValid) {
            userModel.creat(email, prenom, nom, motDePasse, telephone, formattedDate, "actif", function(success) {
                if (success) {
                    console.log("User inserted successfully!");
                } else {
                    console.log("Failed to insert user.");
                }
            });
        } else {
            console.log("Email is not valid.");
        }
    });
}
});

module.exports = router;
