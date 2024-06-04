var db = require('./db.js');

module.exports = {
    read: function (organisation, callback) {
        db.query("SELECT * FROM DemandeAdherRecruteur WHERE  organisation= ?", organisation, function (err, results) {
            if (err) console.log("erreur");
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("SELECT * FROM DemandeAdherRecruteur", function (err, results) {
            if (err) console.log("erreur");
            callback(results);
        });
    },

    create: function (organisation, candidat, callback) {
        let sql = "INSERT INTO DemandeAdherRecruteur (organisation, recruteur, etat) VALUES (?, ?, ?)";
        db.query(sql, [organisation, candidat,"attente"], function (err, results) {
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                return callback(false, err); // (Manon: précédente candidature non garantie ?)
            } else {
                return callback(true);
            }
        });
    },

 
  
};
