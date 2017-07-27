var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name         : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
