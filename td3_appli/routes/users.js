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
router.post('/adduser', function (req, res) {
  const { nom, prenom, mail: email, tel: telephone, mdp: motDePasse } = req.body;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  userModel.areValid(email, function(isValid) {
      if (isValid) {
          userModel.creat(email, prenom, nom, motDePasse, telephone, formattedDate, "actif", function(success) {
              if (success) {
                  console.log("User inserted successfully!");
                  res.json({ message: "User inserted successfully" });
              } else {
                  console.log("Failed to insert user.");
                  res.status(500).json({ error: "Failed to insert user" });
              }
          });
      } else {
          console.log("Email is not valid.");
          res.status(400).json({ error: "Email is not valid" });
      }
  });
});


module.exports = router;
