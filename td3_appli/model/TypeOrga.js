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

    readallTypes: function (callback) {
        db.query("SELECT id, nom FROM TypeOrga", function (err, results) {
            if (err) {
                console.log("Erreur lors de la récupération des types d'organisation :", err);
                return callback(err, null); // Appel du callback avec l'erreur
            }
            callback(null, results); // Appel du callback avec les résultats
        });
    },
// Fonction pour créer un nouveau métier
    create: function (nom, callback) {
        // On vérifie si le métier n'existe pas déjà
        let sql = "INSERT INTO TypeOrga (nom) VALUES (?)";
                // Exécution de la requête SQL.
        db.query(sql, nom, function (err, results) {
             if (err) {
                 console.error("Erreur lors de l'exécution de la requête SQL :", err);
                 callback(false); // Indiquer une erreur à la fonction de rappel
                    }
                    else {
                        callback(true);
                    }
                });
            },
        }
            
 