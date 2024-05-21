var sessions = require("express-session");

module.exports = {
  init: () => {
    return sessions({
      secret: "votre_secret",
      saveUninitialized: true,
      cookie: { maxAge: 3600 * 1000 }, // 60 minutes
      resave: false,
    });
  },

  creatSession: function (session, data, role) {
    session.userid = data.id;
    session.mail = data.mail;
    session.mdp = data.mdp;
    session.name = data.name;
    session.role = role;
    session.firstname = data.firstname;
    session.tel = data.tel; 
    session.creationDate = data.creationDate;
    session.statut = data.statut;
    session.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
    return session;
  },

  isConnected: (session, role) => {
    if (!session.userid || session.userid === undefined) return false;
    if (role && session.role !== role) return false;
    return true;
  },

  deleteSession: function (session) {
    session.destroy();
  },
};