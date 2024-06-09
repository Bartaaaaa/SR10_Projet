const express = require('express');
const router = express.Router();
const userModel = require('../model/Utilisateur')
const roleModel = require('../model/RoleUtilisateur')
const sessionManager = require('../session');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('connexion', { title: 'Express' });
});



router.post('/connexion', (req, res) => {
    userModel.readall(async function(result) {
      let userFound = false;
      let userRole = null;
  
      for (let i = 0; i < result.length; i++) {
        const user = result[i];
  
        if (req.body.mail === user.mail && req.body.mdp === user.mdp) {
            try {
                userRole = await new Promise((resolve, reject) => {
                    roleModel.read(user.id, function (err, roleResult) {
                        if (err) {
                            return reject(err);
                        }
                        if (roleResult && roleResult.length > 0) {
                            // Assuming roleResult is an array of roles, get the first one
                            resolve(roleResult[0].role);
                        } else {
                            resolve(null);
                        }
                    });
                });
            } catch (error) {
                console.error("Error fetching user role:", error);
                // Handle the error appropriately, e.g., return an error response
            }
  



          console.log("User connected successfully!");
          userFound = true;
            console.log(userRole)
          // Create user session
          let data = {
            id: user.id,
            mail: user.mail,
            mdp: user.mdp,
            name: user.nom,
            firstname: user.prenom,
            tel: user.tel,
            creationDate: user.dateCreation,
            statut: user.statut
          };
          if (userRole) {
            data.role = userRole;
          }
          console.log(data);
  
          sessionManager.creatSession(req.session, data);
          break; // Exit loop once a user is found
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

