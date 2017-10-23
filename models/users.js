var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    "nom": String,
    "prenom": String,
    "mail": String,
    "createdAt" : Date,
});

// je crée un model et j'attache le schema ci dessus
var User = mongoose.model('user', userSchema);

module.exports = User;