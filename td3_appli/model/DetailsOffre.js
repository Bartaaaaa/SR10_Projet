// Import du module de base de données personnalisé.
var db = require('./db.js');


module.exports = {


    readall: function (callback) {
        db.query("SELECT * FROM Offre", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }


}