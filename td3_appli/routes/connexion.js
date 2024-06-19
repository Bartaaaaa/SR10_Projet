const express = require('express');
const router = express.Router();
const userModel = require('../model/Utilisateur')
const roleModel = require('../model/RoleUtilisateur')
const sessionManager = require('../session');
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('connexion', { title: 'Express' });
});


const demandeAdherModel = require('../model/DemandeAdherRecruteur')
router.post('/connexion', (req, res) => {
  userModel.readall(async function(result) {
      let userFound = false;
      let userRole = null;
      let userOrganisation = null;

      for (let i = 0; i < result.length; i++) {
          const user = result[i];

          // Comparer le mail
          if (req.body.mail === user.mail ) {

            // Comparer les mots de passe en utilisant bcrypt
              const isMatch = await bcrypt.compare(req.body.mdp, user.mdp);
              if (isMatch) {
              try {
                  userRole = await new Promise((resolve, reject) => {
                      roleModel.read(user.id, function(err, roleResult) {
                          if (err) {
                              return reject(err);
                          }
                          if (roleResult && roleResult.length > 0) {
                              resolve(roleResult[0].role);
                          } else {
                              resolve(null);
                          }
                      });
                  });
              } catch (error) {
                  console.error("Error fetching user role:", error);
                  return res.status(500).json({ error: "Error fetching user role" });
              }

        
           

              console.log("User connected successfully!");
              userFound = true;
              console.log(userRole);
              console.log(userOrganisation);

              // Create user session
              let data = {
                  id: user.id,
                  mail: user.mail,
                  mdp: user.mdp,
                  name: user.nom,
                  firstname: user.prenom,
                  tel: user.tel,
                  creationDate: user.dateCreation,
                  statut: user.statut,
                  role: userRole,
              };

              console.log(data);

              sessionManager.creatSession(req.session, data);
              break; // Exit loop once a user is found
            } 
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

