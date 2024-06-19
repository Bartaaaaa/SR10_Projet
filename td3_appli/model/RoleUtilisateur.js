var db = require('./db.js');
module.exports = {
    // Fonction pour lire les informations d'un utilisateur spécifique par mail.
    read: function (id, callback) {
        // Execute a SQL query to select the role of a user by their ID.
        db.query("SELECT role FROM RoleUtilisateur WHERE utilisateur = ?", [id], function (err, results) {
            if (err) {
                console.error("Error executing SQL query:", err);
                callback(err, null); // Return error to callback
                return;
            }
            callback(null, results); // Return results to callback
        });
    },
    readall: function (callback) {
        // Exécution d'une requête SQL pour sélectionner tous les utilisateurs.
        db.query("SELECT * FROM RoleUtilisateur", function (err, results) {
            // Gestion des erreurs lors de l'exécution de la requête.
            if (err) throw err;
            // Retour des résultats via la fonction de callback.
            callback(results);
        });
    },
    addRole: function (userId, role, callback) {
        console.log("Adding role", role, "to user", userId); // Log the inputs
        // Execute a SQL query to insert a role for a user.
        db.query("INSERT INTO RoleUtilisateur (utilisateur, role) VALUES (?, ?)", [userId, role], function (err, results) {
            if (err) {
                console.error("Error executing SQL query:", err);
                callback(err, null); // Return error to callback
                return;
            }
            console.log("Role added successfully", results); // Log the results
            callback(null, results); // Return results to callback
        });
    },
    majRole: function (userId, newRole, callback) {
        console.log("Updating role for user", userId, "to", newRole); // Log the inputs
        // Execute a SQL query to update the role for a user.
        db.query("UPDATE RoleUtilisateur SET role = ? WHERE utilisateur = ?", [newRole, userId], function (err, results) {
            if (err) {
                console.error("Error executing SQL query:", err);
                callback(err, null); // Return error to callback
                return;
            }
            console.log("Role updated successfully", results); // Log the results
            callback(true, results); // Return results to callback
        });
    }

}

