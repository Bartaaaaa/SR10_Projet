var db = require('./db.js');

module.exports = {
    read: function (siren, callback) {
        db.query("SELECT * FROM Organisation WHERE siren = ?", siren, function (err, results) {
            if (err)                 console.log("erreur");

            callback(results);
        });
    },

    readall: function (callback) {
        db.query("SELECT * FROM Organisation", function (err, results) {
            if (err)                 console.log("erreur");

            callback(results);
        });
    },


    creat: function (siren, nom, adrSiegeSocial, type, callback) {
        let sql = "INSERT INTO Organisation (siren, nom, adrSiegeSocial, type) VALUES (?, ?, ?, ?)";
        db.query(sql, [siren, nom, adrSiegeSocial, type], function (err, results) {
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                callback(true); // Indiquer une erreur à la fonction de rappel
                return; // Arrêter l'exécution de la fonction            } else {
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