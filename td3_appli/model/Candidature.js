var db = require('./db.js');

module.exports = {
    read: function (candidat, callback) {
        db.query("SELECT * FROM Candidature WHERE  candidat = ?", candidat, function (err, results) {
            if (err)                 console.log("erreur");

            callback(results);
        });
    },

    readall: function (callback) {
        db.query("SELECT * FROM Candidature", function (err, results) {
            if (err)                 console.log("erreur");

            callback(results);
        });
    },


    create: function (offreEmploi,candidat,date,piecesChemAcces,etat) {
        let sql = "INSERT INTO Candidature (offreEmploi,candidat,date,piecesChemAcces,etat) VALUES (?,?, ?, ?, ?)";
        db.query(sql, [offreEmploi,candidat,date,piecesChemAcces,etat], function (err, results) {
            if (err) {
                console.error("Erreur lors de l'exécution de la requête SQL :", err);
                alert('Vous avez déjà candidaté à cette offre.') // (Manon: précédente candidature non garantie ?)
               // callback(true); // Indiquer une erreur à la fonction de rappel
                return; // Arrêter l'exécution de la fonction            } else {
            }
        });
    },
    delete : function(offreEmploi,candidat,callback){
        let sql = "DELETE FROM Candidature WHERE offreEmploi = ? AND candidat =  ?";
        db.query(sql,[offreEmploi, candidat],function(err,results){
            if (err){
console.log(err)           
 }else{
                callback(true);
            }
        })
    }
}