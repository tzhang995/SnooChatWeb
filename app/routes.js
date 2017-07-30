var crypto = require('crypto')
var http = require('http')

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      console.log("authenticated");
      res.render('chat.ejs', {
        user : req.user
      }); // load the index.ejs file
    } else {
      console.log("not authenticated");
      res.render('chat.ejs');
    }
  });

  app.get('/auth/reddit', function(req, res, next){
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
      state: req.session.state,
      duration: 'permanent',
    })(req, res, next);
  });

  // the callback after google has authenticated the user
  app.get('/auth/reddit/callback', function(req, res, next){
    // Check for origin via state token
    if (req.query.state == req.session.state){
      passport.authenticate('reddit', {
        successRedirect: '/',
        failureRedirect: '/ASDASDS'
      })(req, res, next);
    }
    else {
      next( new Error(403) );
    }
  });

  app.get('/r/:subreddit', function(req, res){
    res.render("chat.ejs", {
      user : req.user,
      subreddit : req.params.id
    });
  });
};
