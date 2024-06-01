var db = require('./db.js');

module.exports = {
    read: function (id, callback) {
        db.query("SELECT * FROM OffreEmploi WHERE id = ?", id, function (err, results) {
            if (err)                 console.log("erreur");

            callback(results);
        });
    },

    readall: function (callback) {
        db.query("SELECT * FROM OffreEmploi", function (err, results) {
            if (err)                 console.log("erreur");

            callback(results);
        });
    },


    create: function (etatOffre, dateValidite,indication, nbPieces, fichePoste, callback) {
        let sql = "INSERT INTO OffreEmploi (etatOffre, dateValidite,indication, nbPieces, fichePoste, VALUES (?, ?, ?, ?,?)";
        db.query(sql, [etatOffre, dateValidite,indication, nbPieces, fichePoste ], function (err, results) {
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                callback(true); // Indiquer une erreur à la fonction de rappel
                return; // Arrêter l'exécution de la fonction            } else {
            }
        });
    },

    
    delete : function(id ,callback){
        let sql = "DELETE FROM OffreEmploi WHERE id = ?";
        db.query(sql,id,function(err,results){
            if (err){
                throw err;
            }else{
                callback(true);
            }
        })
    }
}