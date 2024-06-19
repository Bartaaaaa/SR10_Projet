var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var app = express();

const session = require('express-session');
app.use(session({
  secret: 'votre_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 } // Exemple pour définir les options de cookie
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var organisationsRouter = require('./routes/organisations');
var fichesPosteRouter = require('./routes/fichesPoste');
var pagepersoRouter = require('./routes/pageperso');
var connexionRouter = require('./routes/connexion');
var inscriptionRouter = require('./routes/inscription');
var offresEmploiRouter = require('./routes/offresemploi');
var candidaturesRouter = require('./routes/candidature');
var filesRouter = require('./routes/files');
var adherenceRouter = require('./routes/DemandeAdherRecruteur');
var detailsOffreRouter = require('./routes/detailsoffre');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/connexion', connexionRouter);
app.use('/inscription', inscriptionRouter);
// Code pour garder la session d'un utilisateur
var sessionJS = require('./session');

// Middleware pour vérifier les sessions et les rôles
app.all("*", function (req, res, next) {
  const adminPaths = [ "/users/usersList"  ]; // Liste des URLs admin ,"/organisations/organisationsList"
  const recruteurPaths = ["/fichesPoste/fichesPosteListe"]; // Ajouter les chemins recruteur ici

  const redirectWithAlert = (message) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirection</title>
          <script>
            alert("${message}");
            window.history.back();
          </script>
      </head>
      <body></body>
      </html>
    `);
  };

  if (req.path.startsWith("/users") && req.path !== '/users/updateUser') { // user n'a accès a aucun des paths sauf pour update
    console.log("Path requires administrateur role");
    if (sessionJS.isConnected(req.session, { role: "administrateur" })) {
      console.log("User has required role");
      return next();
    } else {
      console.log("User does not have required role");
      // return res.status(403).json({error: "User does not have required role"});
      return redirectWithAlert("Cette page n'est pas accessible pour vous");
    }
  }

  if (req.path.startsWith("/DemandeAdherRecruteur") ) {
    console.log("Path requires administrateur role");
    if ((sessionJS.isConnected(req.session, { role: "administrateur" })) || (sessionJS.isConnected(req.session, { role: "recruteur" }))) {
      console.log("User has required role");
      return next();
    } else {
      console.log("User does not have required role");
      return redirectWithAlert("Cette page n'est pas accessible pour vous");
    }
  }




  if (recruteurPaths.includes(req.path)) {
    if (sessionJS.isConnected(req.session, { role: "recruteur" })) {
      return next();
    }
    else if (sessionJS.isConnected(req.session, { role: "administrateur" })) {
      return next();
    } 
     else {
      return redirectWithAlert("Cette page n'est pas accessible pour vous");
    }
  }
  if (adminPaths.includes(req.path)) {
    console.log(req.session);
    if (sessionJS.isConnected(req.session, { role: "administrateur" })) {
      return next();
    } else {
      return redirectWithAlert("Cette page n'est pas accessible pour vous");
    }
  }
  // Pour toutes les autres routes, vérifier si l'utilisateur est connecté
    return next();


});


// Define routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organisations', organisationsRouter);
app.use('/fichesPoste', fichesPosteRouter);

app.use('/pageperso', pagepersoRouter);
app.use('/offresemploi', offresEmploiRouter);
app.use('/candidature', candidaturesRouter);
app.use('/files', filesRouter);
app.use('/DemandeAdherRecruteur', adherenceRouter);
app.use('/detailsoffre', detailsOffreRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
