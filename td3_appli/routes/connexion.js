var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('connexion', { title: 'Express' });
});


/*
app.post('/connexion', function(req, res) {
    const { email, password } = req.body;
    // Ici, vous vérifieriez l'authenticité de l'utilisateur
    if (authentificationValide(email, password)) {
      req.session.user = { email : email };
      res.redirect('/page-secrete');
    } else {
      res.redirect('/connexion');
    }
  });
  */
module.exports = router;

