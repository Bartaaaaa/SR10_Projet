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
    userModel.readall(function(result){
        res.render('usersList', { title: 'Liste des utilisateurs', users: result });
    });
});

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
    function deleteUserCallback (success) {
        if (success) {
            console.log("User deleted successfully!");
            res.json({success: true, message: "User deleted successfully"});
        } else {
            console.log("Failed to delete user.");
            res.json({success: false, message: "Failed to delete user"});
        }
    }
    const mail = req.body.mail
    const id = req.body.id;
    if (id) {
        userModel.deleteById(id, deleteUserCallback);
    } else if (mail) {
        userModel.delete(mail, deleteUserCallback);
    }
});

router.post('/updateRole', function (req, res) {
    function updateRoleCallback(err, result) {
        if (err) {
            console.log("Failed to update role:", err);
            res.status(500).json({ error: "Failed to update role" });
        } else {
            console.log("Role updated successfully!");
            res.json({ message: "Role updated successfully to " + newRole });
        }
    }
    const { userId, newRole } = req.body;
    try {
        roleModel.read(userId, function (err, results) {
            if (results.length === 0) {
                console.log('No prior role. Adding role...');
                roleModel.addRole(userId, newRole, () => updateRoleCallback(err, results));
            } else {
                console.log('Updating role...');
                roleModel.majRole(userId, newRole, () => updateRoleCallback(err, results));
            }
        });
    } catch(e) {
        console.log('error here')
    }
});

router.get('/:id', function (req, res) {
    const id = req.params.id;
    userModel.readId(id, function (results) {
        const user = results[0]
        if (user !== undefined) {
            roleModel.read(id, function(err, roleResults) {
                if (err) {
                    console.log("Failed to get role:", err);
                } 
                const role = roleResults[0]?.role ?? 'Rôle non défini';
                user.role = role;
                res.render('detailutilisateur', { user });
            })
        } else {
            res.status(404).json({ error: "User not found" });
        }
    })
});

router.post('/updateUser', function (req, res) {
    const { id, nom, prenom, tel, mail, statut } = req.body;
    let canUpdate = false;
    // Vérifier si id de requête === id de utilisateur connecté, si oui canUpdate = true

    if (!canUpdate) {
        // ID à prendre ici = id de l'utilisateur connecté, pas id de la requête
        roleModel.read(id, function(err, roleResults) {
            if (err) {
                console.log("Failed to get role:", err);
                res.status(500).json({ error: "Failed to get role" });
            } else {
                const role = roleResults[0].role;
                if (role === "administrateur") {
                    console.log('User is admin');
                    canUpdate = true;
                } else {
                    console.log('Not admin, cannot update');
                }
            }
        });
    }

    if (canUpdate) {
        userModel.update(id, mail, nom, prenom, tel, statut, function(updateSuccessful) {
            if (!updateSuccessful) {
                console.log("Failed to update user");
                res.status(500).json({ error: "Failed to update user" });
            } else {
                console.log("User updated successfully!");
                res.json({ message: "User updated successfully" });
            }
        });
    } else {
        res.status(500).json({ error: "Impossible de modifier un autre utilisateur sans être administrateur" });
    }
});

module.exports = router;
