var db = require('./db.js');

module.exports = {
    read: function (id, callback) {
        db.query("SELECT id FROM FichePoste WHERE id = ?", id, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("SELECT * FROM FichePoste", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    creat: function (etat, lieuMission, rythme, salaireMin, salaireMax, description, responsableHierarchique, metier, statutPoste, organisation, callback) {
        // Vérification des conditions sur les salaires minimum et maximum
        if (salaireMin < 0 || salaireMax < 0 || salaireMin > salaireMax) {
            // Si les conditions ne sont pas satisfaites, on appelle le callback avec false pour indiquer un échec
            callback(false, "Les valeurs de salaire sont invalides.");
            return;
        }
    
        // Si les conditions sont satisfaites, on procède à l'insertion des données
        let sql = "INSERT INTO FichePoste (etat, lieuMission, rythme, salaireMin, salaireMax, description, responsableHierarchique, metier, statutPoste, organisation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [etat, lieuMission, rythme, salaireMin, salaireMax, description, responsableHierarchique, metier, statutPoste, organisation], function (err, results) {
            if (err) {
                // En cas d'erreur lors de l'insertion, on appelle le callback avec false et l'erreur
                callback(false, err.message);
            } else {
                // Si l'insertion réussit, on appelle le callback avec true pour indiquer le succès
                callback(true);
            }
        });
    },
    
    delete : function(id,callback){
        let sql = "DELETE FROM FichePoste WHERE id = ?";
        db.query(sql,id,function(err,results){
            if (err){
                throw err;
            }else{
                callback(true);
            }
        })
    }
}