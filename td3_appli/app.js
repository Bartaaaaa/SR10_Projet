var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

const session = require('express-session');
app.use(session({
  secret: 'votre_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 } // Example for setting cookie options
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var organisationsRouter = require('./routes/organisations');
var fichesPosteRouter = require('./routes/fichesPoste');

var pagepersoRouter = require('./routes/pageperso');

var connexionRouter = require('./routes/connexion');
var inscriptionRouter = require('./routes/inscription');



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



//Ce code va nous permettre plus tard de gérer quel page est accessible à queltype d'utilisateur
var sessionJS=require('./session');
// check user before app.use (path, router)
app.all("*", function (req, res, next) {
  const nonSecurePaths = ["/connexion", "/inscription"];
  const adminPaths = []; //list des urls admin
  if (nonSecurePaths.includes(req.path)) return next();
  //authenticate user
  if (adminPaths.includes(req.path)) {
  if (sessionJS.isConnected(req.session, "admin")) return next();
  else
  res
  .status(403)
  .render("error", { message: " Unauthorized access", error: {} });
  } else {
    if (sessionJS.isConnected(req.session)) return next();
  // not authenticated
    else res.redirect("/inscription");
  }
  });
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  