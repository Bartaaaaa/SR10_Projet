var express = require('express');
var userModel = require('../model/Utilisateur')
var router = express.Router();
var roleModel = require('../model/RoleUtilisateur')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/verifuser', function(req, res, next) {
  userModel.readall(function(result) {
      let userFound = false;
      for (let i = 0; i < result.length; i++) {
          const user = result[i];
          if (req.body.mail === user.mail && req.body.mdp === user.mdp) {
              console.log("User connected successfully!");
              userFound = true;
              break; // Sortir de la boucle une fois qu'un utilisateur est trouvé
          }
      }
      if (userFound) {
          res.json({ success : true ,message: "User connected successfully" });
      } else {
          console.log("Failed to connect user.");
          res.status(500).json({ error: "Failed to connect user" });
      }
  });
});


    //  const email = req.body.mail;
  //  const mdp = req.body.mdp;
//
  //  userModel.isValidUser(email, mdp, function(connexionOk){
  //    if (success) {
  //      console.log("User connected successfully!");
  //      res.json({ message: "User  connected successfully" });
  //  } else {
  //      console.log("Failed to connect user.");
  //      res.status(500).json({ error: "Failed to connectuser" });
  //};
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

    userModel.areValid(email, function (isValid) {
        if (isValid) {
            userModel.creat(email, prenom, nom, motDePasse, telephone, formattedDate, "actif", function (err, userId) {
                if (err) {
                    console.log("Failed to insert user.");
                    res.status(500).json({ error: "Failed to insert user" });
                } else {
                    console.log("User created with ID:", userId); // Log the new user ID
                    roleModel.addRole(userId, 'candidat', function (err, result) {
                        if (err) {
                            console.log("Failed to add role:", err);
                            res.status(500).json({ error: "User created but failed to assign role" });
                        } else {
                            console.log("User inserted and role assigned successfully!");
                            res.json({ message: "User inserted and role assigned successfully" });
                        }
                    });
                }
            });
        } else {
            console.log("Email is not valid.");
            res.status(400).json({ error: "Email is not valid" });
        }
    });
});


//Supprimer un utilisateur 
router.post('/deleteuser', function (req, res) {
    const email = req.body.email;
  
    userModel.delete(email, function(success) {
        if (success) {
            console.log("User deleted successfully!");
            res.json({success: true, message: "User deleted successfully"});
        } else {
            console.log("Failed to delete user.");
            res.json({success: false, message: "Failed to delete user"});
        }
    });
});



module.exports = router;
