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
        let sql = "INSERT INTO TypeOrga (nom) VALUES (?)";
                // Exécution de la requête SQL.
        db.query(sql, nom, function (err, results) {
             if (err) {
                 console.error("Erreur lors de l'exécution de la requête SQL :", err);
                 callback(true); // Indiquer une erreur à la fonction de rappel
                  return; // Arrêter l'exécution de la fonction            } else {
                    }
                });
            },
        }
            
 