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

    readUser: function (recruteur, callback) {
        db.query("SELECT * FROM DemandeAdherRecruteur WHERE recruteur = ?", [recruteur], function (err, results) {
            if (err) {
                console.log("Erreur lors de la lecture de l'utilisateur :", err);
                callback(err, null);
            } else {
                callback(null, results[0]); // Supposons qu'il n'y a qu'un seul utilisateur correspondant
            }
        });
    },
    update: function(organisation, recruteur, etat,  callback) {
        const sql = "UPDATE DemandeAdherRecruteur SET organisation = ?, recruteur = ?, etat = ? WHERE organisation = ? AND recruteur = ?";
        db.query(sql, [organisation, recruteur, etat, organisation, recruteur], function(err, results) {
            if (err) {
                console.error('Error while updating user:', err);
                callback(false);
            } else {
                callback(true);
            }
        });
    }
    
  
};
