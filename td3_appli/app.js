var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var organisationsRouter = require('./routes/organisations');
var fichesPosteRouter = require('./routes/fichesPoste');

var pagepersoRouter = require('./routes/pageperso');

var connexionRouter = require('./routes/connexion');
var inscriptionRouter = require('./routes/inscription');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organisations', organisationsRouter);
app.use('/fichesposte', fichesPosteRouter);
app.use('/connexion', connexionRouter);
app.use('/inscription',inscriptionRouter);
app.use('/pageperso',pagepersoRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//code pour garder la session d'un utilisateur : 

const session = require('express-session');

app.use(session({
  secret: 'votre_secret_ici', // Une chaîne secrète pour signer le cookie de session
  resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
  saveUninitialized: false, // Ne pas créer de session jusqu'à ce que quelque chose y soit stocké
  cookie: { secure: true } // Les cookies ne seront envoyés que sur HTTPS
}));
