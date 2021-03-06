var crypto = require('crypto')
var request = require('request');

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    var subreddit = req.query.subreddit;
    if (subreddit != undefined) {
      request('http://www.reddit.com/r/'+subreddit+'/about.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var newbody = JSON.parse(body);
          var title = newbody['data']['display_name'];
          if (title ==  undefined){
            console.log("does not exist");
            res.render('404page.ejs');
          } else {
            if (req.isAuthenticated()) {
              console.log("authenticated");
              res.render('chat.ejs', {
                user : req.user,
                channel : title
              }); // load the index.ejs file
            } else {
              console.log("not authenticated");
              res.render('chat.ejs', {
                channel : title
              });
            }
          }
        }
      });
    } else {
      if (req.isAuthenticated()) {
        console.log("authenticated");
        res.render('chat.ejs', {
          user : req.user,
          channel : subreddit
        }); // load the index.ejs file
      } else {
        console.log("not authenticated");
        res.render('chat.ejs', {
          channel : subreddit
        });
      }
    }
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
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
    var string = encodeURIComponent(req.params.subreddit);
    res.redirect('/?subreddit='+string);
  });

  app.get('/about', function(req, res){
    res.render('about.ejs');
  });
};
