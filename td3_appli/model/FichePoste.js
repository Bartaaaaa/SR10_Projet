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
    },

    readAllInfo: function (callback) {
        const sql = "SELECT "
        + "fp.id AS fichePoste_id, "
        + "fp.etat AS fichePoste_etat, "
        + "fp.lieuMission, "
        + "fp.rythme, "
        + "fp.salaireMin, "
        + "fp.salaireMax, "
        + "fp.description, "
        + "fp.statutPoste, "
        // + "fp.responsableHierarchique, " (Manon) : pas de responsable hiérarchique dans la table pour l'instant
        + "sp.nom as statutPoste_nom, "
        + "m.id AS metier_id, "
        + "m.nom AS metier_nom, "
        + "o.siren AS organisation_siren, "
        + "o.nom AS organisation_nom, "
        + "o.adrSiegeSocial, "
        + "o.type AS organisation_type "
        + "FROM FichePoste fp "
        + "JOIN METIER m ON fp.metier = m.id "
        + "JOIN Organisation o ON fp.organisation = o.siren "
        + "JOIN StatutPoste sp ON fp.statutPoste = sp.id; "

        db.query(sql, function (err, results) {
            if (err) console.log("Erreur :", err);
            callback(results);
        });
    }
}