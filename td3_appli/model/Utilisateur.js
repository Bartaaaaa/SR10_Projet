// Import du module de base de données et du module de hachage
var db = require('./db.js');
const bcrypt = require('bcrypt');

// Exportation d'un objet contenant des fonctions pour interagir avec la base de données 'Utilisateur'.
module.exports = {
    // Fonction pour lire les informations d'un utilisateur spécifique par mail.
    read: function (mail, callback) {
        // Exécution d'une requête SQL pour sélectionner un utilisateur par son mail.
        db.query("SELECT * FROM Utilisateur WHERE mail = ?", mail, function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) throw err;
            // Retour des résultats via la fonction de callback.
            callback(results);
        });
    },





    // Renvoie un utilisateur à partir de son id
    readId: function (id, callback) {
        db.query("SELECT * FROM Utilisateur WHERE id = ?", id, function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) throw err;
            // Retour des résultats via la fonction de callback.
            callback(results);
        });
    },




    // Fonction pour lire les informations de tous les utilisateurs.
    readall: function (callback) {
        // Exécution d'une requête SQL pour sélectionner tous les utilisateurs.
        db.query("SELECT * FROM Utilisateur", function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) throw err;
            // Retour des résultats via la fonction de callback.
            callback(results);
        });
    },





    // (Manon) Surement à supprimer
    // Fonction pour vérifier si un couple mail/mot de passe est valide.
    areValid: function (mail, callback) {
        // Définition de la requête SQL pour obtenir le mail et le mot de passe d'un utilisateur donné.
        let sql = "SELECT mail FROM Utilisateur WHERE mail = ?";
        // Exécution de la requête SQL.
        db.query(sql, mail, function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                callback(true); // Indiquer une erreur à la fonction de rappel
                return; // Arrêter l'exécution de la fonction
            }
            // Vérification si un utilisateur correspondant a été trouvé
            if (results.length === 1) {
                // L'utilisateur existe, on renvoie false
                callback(false);
            } else {
                // Aucun utilisateur correspondant trouvé, on renvoie true
                callback(true);
            }
        });
    },


    // m
    // Connexion de l'utilisateur
    isValidUser: function (mail,mdp, callback) {
        // Définition de la requête SQL pour obtenir le mail et le mot de passe d'un utilisateur donné.
        let sql = "SELECT mdp FROM Utilisateur WHERE mail = ?";
        // Exécution de la requête SQL.
        db.query(sql, mail, function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                callback(true); // Indiquer une erreur à la fonction de rappel
                return; // Arrêter l'exécution de la fonction
            }
            // Vérification si un utilisateur correspondant a été trouvé
            if (results.length === 1 && results ===mdp) {
                // L'utilisateur existe, on renvoie false
                callback(false);
            } else {
                // Aucun utilisateur correspondant trouvé, on renvoie true
                callback(true);
            }
        });
    },




    // Fonction pour créer un nouvel utilisateur.
    creat: function (mail, nom, prenom, mdp, tel, dateCreation, statut, callback) {

        // Hachage du mot de passe
        bcrypt.hash(mdp, 10, function(err, hashedMdp) {
            if (err) {
                console.error("Erreur lors du hachage du mot de passe :", err);
                callback(err, null); // Indiquer une erreur au callback
                return;
            }

            // Définition de la requête SQL pour insérer un nouvel utilisateur.
            let sql = "INSERT INTO Utilisateur (mail, nom, prenom, mdp, tel, dateCreation, statut) VALUES (?, ?, ?, ?, ?, ?, ?)";
            // Exécution de la requête SQL.
            
            db.query(sql, [mail, nom, prenom, hashedMdp, tel, dateCreation, statut], function (err, results) {
                // Gestion des erreurs lors de l'exécution de la requête.
                if (err) {
                    console.error("Erreur lors de l'exécution de la requête SQL :", err);
                    callback(err, null); // Indiquer une erreur à la fonction de rappel
                    return; // Arrêter l'exécution de la fonction
                } else {
                    // Si l'insertion réussit, exécuter la fonction de callback avec l'ID de l'utilisateur.
                    callback(null, results.insertId); //propriété de mysql, renvoie l'id incrémenté de l'utilisateur
                }
            });
        });
    },


    // Fonction pour supprimer un utilisateur.
    delete: function(mail, callback) {
        let sql = "DELETE FROM Utilisateur WHERE mail = ?";
        db.query(sql, mail, function(err, results) {
            if (err) {
                console.error('Error while deleting user:', err);
                callback(false);
            } else {
                callback(true);
            }
        });
    },

    deleteById: function(id, callback) {
        let sql = "DELETE FROM Utilisateur WHERE id = ?";
        db.query(sql, id, function(err, results) {
            if (err) {
                console.error('Error while deleting user:', err);
                callback(false);
            } else {
                callback(true);
            }
        });
    },

    update: function(id, mail, nom, prenom, tel, callback) {
        const sql = "UPDATE Utilisateur SET mail = ?, nom = ?, prenom = ?, tel = ? WHERE id = ?";
        db.query(sql, [mail, nom, prenom, tel, id], function(err, results) {
            if (err) {
                console.error('Error while updating user:', err);
                callback(false);
            } else {
                callback(true);
            }
        });
    }
    

}
