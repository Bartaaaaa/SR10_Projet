var express = require('express');
var userModel = require('../model/Utilisateur')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/userslist', function (req, res, next) {
  result=userModel.readall(function(result){
   // userModel.creat("qzdzqd@aqzdqzdcom", "john", "Jennifer", "mdp", "tel78", "1122-12-20", "actif", function(success){
   //   if (success) {
   //     console.log("User inserted successfully!");
   // } else {
   //     console.log("Failed to insert user.");
   // }
 // });
  res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

router.post('/adduser', function (req, res, next) {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.mail;
  const telephone = req.body.tel;
  const motDePasse = req.body.mdp;
  const dateNaissance = req.body.date;

  // Appel à la fonction create de userModel avec les données du formulaire
  result=userModel.readall(function(result){
  res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
  if (email!==null){
  userModel.creat(email, prenom, nom, motDePasse, telephone, dateNaissance, "actif", function(success){
     if (success) {
       console.log("User inserted successfully!");
   } else {
       console.log("Failed to insert user.");
   }
  });}
});

module.exports = router;
