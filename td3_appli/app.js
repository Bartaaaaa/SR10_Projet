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
  cookie: { maxAge: 60000 } // Exemple pour définir les options de cookie
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
  const nonSecurePaths = ["/", "/connexion", "/inscription", "/offresemploi/offresemploilist", "/fichesPoste/fichesPosteListe","/pageperso" ,"/candidature/mescandidatures"];
  const adminPaths = ["/organisations/organisationsList", "/users/usersList"]; // Liste des URLs admin
  const recruteurPaths = ["/organisations/organisationsList"]; // Ajouter les chemins recruteur ici

  // Si la route est non sécurisée, on passe au middleware suivant
  if (nonSecurePaths.includes(req.path)) return next();

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

  if (sessionJS.isConnected(req.session, { role: "administrateur" })) {
    if (adminPaths.includes(req.path) ) {
      return next();
    } else {
      return redirectWithAlert("Cette page est uniquement accessible aux administrateurs");
    }
  }

  if (sessionJS.isConnected(req.session, { role: "recruteur" })) {
    if (recruteurPaths.includes(req.path)) {
      return next();
    } else {
      return redirectWithAlert("Cette page est uniquement accessible aux recruteurs");
    }
  }

  // Vérifier si l'utilisateur est connecté pour les autres routes
  if (sessionJS.isConnected(req.session, {})) {
    return next();
  } else {
    return redirectWithAlert("Vous devez être connecté pour accéder à cette page");
  }
});


// Define routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organisations', organisationsRouter);
app.use('/fichesposte', fichesPosteRouter);

app.use('/pageperso', pagepersoRouter);
app.use('/offresemploi', offresEmploiRouter);
app.use('/candidature', candidaturesRouter);
app.use('/files', filesRouter);
app.use('/DemandeAdherRecruteur', adherenceRouter);

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
