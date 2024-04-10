// Import du module de base de données personnalisé.
var db = require('./db.js');

module.exports = {
    //

    readall: function (callback) {
        db.query("SELECT * FROM Metier", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },


// Fonction pour créer un nouveau métier
    create: function (nom, callback) {
        // On vérifie si le métier n'existe pas déjà
        let sql_verif = "SELECT nom FROM Metier WHERE nom = ?";

        db.query(sql_verif, [nom], function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) {
                callback(err);
                return;
            }
            if (results.length > 0) {
                // Si le métier existe déjà, retour de false.
                callback(null, false);
            } else {
                let sql = "INSERT INTO Metier (nom) VALUES (?)";
                // Exécution de la requête SQL.
                db.query(sql, [nom], function (err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        // Si l'insertion réussit, exécuter la fonction de callback avec true.
                        callback(null, true);
                    }
                });
            }
        });
    },
}