var db = require('./db.js');

module.exports = {

    // Récupérer l'offre d'emploi à partir de son id
    read: function (id, callback) {
        db.query("SELECT * FROM OffreEmploi WHERE id = ?", id, function (err, results) {
            if (err)                 console.log("erreur");

            callback(results);
        });
    },

    // Récupérer toutes les offres d'emploi
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
    },


    // récupère toutes les informations liées à une offre grâce à son id
    // des infos seront peut être à supprimer si elles ne sont pas utilisées
    readAllInfo : function(id, callback){ 
        const sql = "SELECT "
        + "oe.id AS offre_id, "
        + "oe.etatOffre, "
        + "oe.dateValidite, "
        + "oe.indication, "
        + "oe.nbPieces, "
        + "fp.id AS fichePoste_id, "
        + "fp.etat AS fichePoste_etat, "
        + "fp.lieuMission, "
        + "fp.rythme, "
        + "fp.salaireMin, "
        + "fp.salaireMax, "
        + "fp.description, "
        + "fp.statutPoste, "
        + "sp.nom as statutPoste_nom, "
        + "m.id AS metier_id, "
        + "m.nom AS metier_nom, "
        + "o.siren AS organisation_siren, "
        + "o.nom AS organisation_nom, "
        + "o.adrSiegeSocial, "
        + "o.type AS organisation_type "
    + "FROM OffreEmploi oe "
    + "JOIN FichePoste fp ON oe.fichePoste = fp.id "
    + "JOIN METIER m ON fp.metier = m.id "
    + "JOIN Organisation o ON fp.organisation = o.siren "
    + "JOIN StatutPoste sp ON fp.statutPoste = sp.id "
    + "WHERE oe.id = ?;"
    
        db.query(sql, id, function (err, results) {
            if (err) console.log("Erreur :", err);
            callback(results);
        })
    },

    // récupère toutes les informations liées à toutes les offres
    readAllInfoOfAllOffers : function(callback){ 
        const sql = "SELECT "
        + "oe.id AS offre_id, "
        + "oe.etatOffre, "
        + "oe.dateValidite, "
        + "oe.indication, "
        + "oe.nbPieces, "
        + "fp.id AS fichePoste_id, "
        + "fp.etat AS fichePoste_etat, "
        + "fp.lieuMission, "
        + "fp.rythme, "
        + "fp.salaireMin, "
        + "fp.salaireMax, "
        + "fp.description, "
        + "fp.statutPoste, "
        + "sp.nom as statutPoste_nom, "
        + "m.id AS metier_id, "
        + "m.nom AS metier_nom, "
        + "o.siren AS organisation_siren, "
        + "o.nom AS organisation_nom, "
        + "o.adrSiegeSocial, "
        + "o.type AS organisation_type "
    + "FROM OffreEmploi oe "
    + "JOIN FichePoste fp ON oe.fichePoste = fp.id "
    + "JOIN METIER m ON fp.metier = m.id "
    + "JOIN Organisation o ON fp.organisation = o.siren "
    + "JOIN StatutPoste sp ON fp.statutPoste = sp.id; "

        db.query(sql, function (err, results) {
            if (err) console.log("Erreur :", err);
            callback(results);
        })
    }
}