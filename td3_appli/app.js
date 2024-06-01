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

// var detailsOffre = require('./routes/detailsoffre.js')
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

// Define routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organisations', organisationsRouter);
app.use('/fichesposte', fichesPosteRouter);
app.use('/connexion', connexionRouter);
app.use('/inscription', inscriptionRouter);
app.use('/pageperso', pagepersoRouter);
app.use('/offresemploi', offresEmploiRouter);
app.use('/candidature', candidaturesRouter);
app.use('/files', filesRouter);

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

// Code pour garder la session d'un utilisateur
var sessionJS = require('./session');

// Ce code va nous permettre plus tard de gérer quelle page est accessible à quel type d'utilisateur
app.all("*", function (req, res, next) {
  const nonSecurePaths = ["/connexion", "/inscription"];
  const adminPaths = []; // Liste des urls admin
  if (nonSecurePaths.includes(req.path)) return next();
  // Authentification de l'utilisateur
  if (adminPaths.includes(req.path)) {
    if (sessionJS.isConnected(req.session, "admin")) return next();
    else
      res.status(403).render("error", { message: "Unauthorized access", error: {} });
  } else {
    if (sessionJS.isConnected(req.session)) return next();
    // Non authentifié
    else res.redirect("/inscription");
  }
});

module.exports = app;
