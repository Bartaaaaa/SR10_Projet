// Import du module de base de données personnalisé.
var db = require('./db.js');

module.exports = {
    //

    readall: function (callback) {
        db.query("SELECT * FROM TypeOrga", function (err, results) {
            if (err)           
                  console.log("erreur");

            callback(results);
        });
    },


// Fonction pour créer un nouveau métier
    create: function (nom, callback) {
        // On vérifie si le métier n'existe pas déjà
        let sql_verif = "SELECT nom FROM TypeOrga WHERE nom = ?";

        db.query(sql_verif, [nom], function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) {
                console.log("erreur");
                return;
            }
            if (results.length > 0) {
                // Si le métier existe déjà, retour de false.
                console.log("erreur");
            } else {
                let sql = "INSERT INTO TypeOrga (nom) VALUES (?)";
                // Exécution de la requête SQL.
                db.query(sql, [nom], function (err, results) {
                    if (err) {
                        console.log("erreur");
                    } else {
                        // Si l'insertion réussit, exécuter la fonction de callback avec true.
                        callback(null, true);
                    }
                });
            }
        });
    },
}