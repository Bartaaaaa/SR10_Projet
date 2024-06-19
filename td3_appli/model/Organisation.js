var db = require('./db.js');

module.exports = {
    read: function (siren, callback) {
        db.query("SELECT * FROM Organisation WHERE siren = ?", [siren], function (err, results) {
            if (err) {
                console.log("Erreur lors de la lecture de l'organisation :", err);
                callback(err, null);
            } else {
                callback(null, results[0]); // Supposons qu'il n'y a qu'une seule organisation correspondant
            }
        });
    },

    readall: function (callback) {
        db.query("SELECT * FROM Organisation", function (err, results) {
            if (err)                 console.log("erreur");

            callback(results);
        });
    },


    create: function (siren, nom, adrSiegeSocial, type, callback) {
        let sql = "INSERT INTO Organisation (siren, nom, adrSiegeSocial, type) VALUES (?, ?, ?, ?)";
        db.query(sql, [siren, nom, adrSiegeSocial, type], function (err, results) {
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                callback(false); // Arrêter l'exécution de la fonction            } else {
            }
            else{
                callback(true);

            }
        });
    },

    update: function (siren, nom, adrSiegeSocial, type, callback) {
        let sql = "UPDATE Organisation SET nom = ?, adrSiegeSocial = ?, type = ? WHERE siren = ?";
        db.query(sql, [nom, adrSiegeSocial, type, siren], function (err, results) {
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                callback(false); // Arrêter l'exécution de la fonction            } else {
            }
            else{
                callback(true);
            }
        });
    },
    delete : function(siren,callback){
        let sql = "DELETE FROM Organisation WHERE siren = ?";
        db.query(sql,siren,function(err,results){
            if (err){
                throw err;
            }else{
                callback(true);
            }
        })
    }
}