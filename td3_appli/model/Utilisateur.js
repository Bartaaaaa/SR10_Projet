// Import du module de base de données personnalisé.
var db = require('./db.js');

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
    

    // Fonction pour créer un nouvel utilisateur.
    creat: function (mail, nom, prenom, mdp, tel, dateCreation, statut, callback) {
        // Définition de la requête SQL pour insérer un nouvel utilisateur.
        let sql = "INSERT INTO Utilisateur (mail, nom, prenom, mdp, tel, dateCreation, statut) VALUES (?, ?, ?, ?, ?, ?, ?)";
        // Exécution de la requête SQL.
        db.query(sql, [mail, nom, prenom, mdp, tel, dateCreation, statut], function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                callback(true); // Indiquer une erreur à la fonction de rappel
                return; // Arrêter l'exécution de la fonction
            } else {
                // Si l'insertion réussit, exécuter la fonction de callback avec true.
                callback(true);
            }
        });
    },
    delete : function(mail,callback){
        let sql = "DELETE FROM Utilisateur WHERE mail = ?";
        db.query(sql,mail,function(err,results){
            if (err){
                throw err;
            }else{
                callback(true);
            }
        })
    }

}
