var express = require('express');
var port = process.env.PORT || 8080;
var app = express();
var session      = require('express-session');
var flash    = require('connect-flash');

var passport = require('passport');

require('./config/passport')(passport); // pass passport for configuration

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.disable('x-powered-by')
app.set('view engine', 'ejs')
app.set('port', port);
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'ilovetonyzhang',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(app.get('port'), function() {
	console.log("Express started on localhost: " + app.get('port'));
})
