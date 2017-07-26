var express = require('express');
var port = process.env.PORT || 8080;
var app = express();


var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/snoochat');

app.disable('x-powered-by')
app.set('view engine', 'ejs')
app.set('port', port);
app.use(express.static(__dirname + '/public'));
app.use(function(req,res,next){
    req.db = db;
    next();
});

require('./app/routes.js')(app);

app.listen(app.get('port'), function() {
	console.log("Express started on localhost: " + app.get('port'));
})
