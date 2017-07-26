
module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('chat.ejs'); // load the index.ejs file
  });

  app.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
      res.render('userlist', {
        "userlist" : docs
      });
    });
  });
};
