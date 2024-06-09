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
    },




    ////////// RECUPERER L'ORGANISATION D'UN RECRUTEUR //////////
    /**
     * Récupérer le SIREN de l'organisation dont l'utilisateur est recruteur
     * (si le tableau de retour ne contient rien, c'est que l'utilisateur est recruteur sans organisation ou non recruteur) 
     * @param {int} userId - id de l'utilisateur
     * @returns {array} un tableau contenant le SIREN de l'organisation dont l'utilisateur est recruteur
     */
    getOrgaDuRecruteur: function(id, callback){

        // Exécution d'une requête SQL pour sélectionner l'organisation dont la demande pour devenir recruteur est validee et qui a comme recruteur l'id donné 
        const sql = "SELECT o.siren, o.nom, o.adrSiegeSocial, o.type "
        + "FROM DemandeAdherRecruteur dar "
        + "JOIN Organisation o ON dar.organisation = o.siren "
        + "WHERE etat = 'validee' AND recruteur = ?;"

        db.query(sql, id, function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) throw err;
            // Retour des résultats via la fonction de callback.
            callback(results);
        });
    }
};
