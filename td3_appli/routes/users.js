const express = require('express');
const userModel = require('../model/Utilisateur')
const router = express.Router();
const roleModel = require('../model/RoleUtilisateur')
const AdherenceModel = require('../model/DemandeAdherRecruteur')

////////// ???? //////////
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

function traitementUser(user) {
    if (user) {
        const newUser = {...user};
        const dateCrea = new Date(user.dateCreation);
        const jour = String(dateCrea.getDate()).padStart(2, '0'); // padStart permet d'avoir 2 chiffres pour le jour
        const mois = String(dateCrea.getMonth() + 1).padStart(2, '0'); // janvier = 0 ici, donc +1
        const an = dateCrea.getFullYear();
        newUser.dateCreation = `${jour}/${mois}/${an}`;
        delete newUser.mdp;
        return newUser;
    }
}

router.get('/userslist', function (req, res) {
    userModel.readall(function(result){
        const allUserInfo = result.map(user => traitementUser(user));
        res.render('usersList', { title: 'Liste des utilisateurs', users: allUserInfo });
    });
});





////////// RECUPERATION DES INFO DE L'UTILISATEUR POUR AFFICHAGE DE LA PAGE DETAILS UTILISATEUR ////////// --> a laisser en dernier getter, sinon erreur 404
router.get('/:id', function (req, res) {
    const id = req.params.id; //récupérer l'id dans l'URL
    const connectedUserRole = req.session.role;

    // récupérer les infos de l'utilisateur à partir de l'id dans l'URL
    userModel.readId(id, function (results) {
        const user = results[0];

        if (user === undefined) { // si l'id dans l'URL n'existe pas dans la table des utilisateurs
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        } else {
            // Récupérer le role de l'utilisateur
            roleModel.read(id, function(err, roleResults) {
                if (err) {
                    console.log("Failed to get role:", err);
                }
                // Explications :
                // - '?.' = 'si l'attribut suivant existe, on le renvoie, sinon on renvoie undefined'
                // - '??' = 'si l'élément avant le ?? existe, on le renvoie, sinon on renvoie celui d'après'
                const role = roleResults[0]?.role ?? 'Rôle non défini';
                user.role = role;

                // Si l'utilisateur est recruteur, récupérer son organisation
                if (role === "recruteur" || role === "administrateur"){ // (Manon) j'ai mis les 2 au cas où on garde le fait qu'un utilisateur n'a qu'un seul role
                    AdherenceModel.getOrgaDuRecruteur(id, function(result){
                        organisation = result[0];

                        if (organisation === undefined || organisation === null) {
                            user.orga = "Aucune organisation";
                        } else {
                            user.orga = organisation.nom + " (SIREN : " + organisation.siren + ")";
                        }
                        res.render('detailutilisateur', {
                            user: user,
                            title: "Détail utilisateur",
                            isPagePerso: false,
                            connectedUserRole: connectedUserRole
                        }); // mis 2 fois parce-que user.orga est une var locale ici
                    })
                } else {
                    res.render('detailutilisateur', {
                        user: user,
                        title: "Détail utilisateur",
                        isPagePerso: false,
                        connectedUserRole: connectedUserRole
                    });
                }
            })
        }
    })
});



////////// AJOUTER UN UTILISATEUR //////////
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






////////// SUPPRIMER UN UTILISATEUR //////////
// (Manon) A modifier : je pense qu'il est mieux de passer l'utilisateur d'actif à inactif
router.post('/deleteuser', function (req, res) {
    function deleteUserCallback (success) {
        if (success) {
            console.log("User deleted successfully!");
            res.json({success: true, message: "User deleted successfully"});
        } else {
            console.log("Failed to delete user.");
            res.json({success: false, message: "Erreur lors de la suppression de l'utilisateur : L'utilisateur possède peut etre une candidature ou appartient à une organisation"});
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





////////// METTRE A JOUR LE ROLE D'UN UTILISATEUR //////////
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




function updateUser(id, mail, nom, prenom, tel) {
    userModel.update(id, mail, nom, prenom, tel, function(updateSuccessful) {
        if (!updateSuccessful) {
            console.log("Failed to update user");
            throw new Error('Failed to update user');
        } else {
            console.log("User updated successfully!");
        }
    });
}

////////// MODIFIER UN UTILISATEUR //////////
router.post('/updateUser', function (req, res) {
    // (Manon) marche sûrement pas, jsp pq
    if (!req.session.userid) {
        res.redirect('/connexion');
    }
    const { id, nom, prenom, tel, mail } = req.body;
    let canUpdate = false;
    if (req.session.userid === id) {
        canUpdate = true;
    }
    // Vérifier si id de requête === id de utilisateur connecté, si oui canUpdate = true
    if (!canUpdate) {
        roleModel.read(req.session.userid, function(err, roleResults) {
            if (err) {
                console.log("Failed to get role:", err);
                res.status(500).json({ error: "Failed to get role" });
            } else {
                const role = roleResults[0].role;
                if (role === "administrateur") {
                    console.log('User is admin');
                    try {
                        updateUser(id, mail, nom, prenom, tel);
                        res.status(200).json({ message: "User updated successfully" });
                    } catch (e) {
                        res.status(500).json({ error: "Impossible de modifier un autre utilisateur sans être administrateur" });
                    }
                } else {
                    console.log('Not admin, cannot update');
                }
            }
        });
    } else {
        try {
            updateUser(id, mail, nom, prenom, tel);
        } catch (e) {
            res.status(500).json({ error: "Impossible de modifier un autre utilisateur sans être administrateur" });
        }
    }
});

module.exports = router;
