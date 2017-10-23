var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    "nom": String,
    "prenom": String,
    "mail": String,
    "createdAt" : Date
});

// je crée un model et j'attache le schema ci dessus
var Users = mongoose.model('users', userSchema);

module.exports = Users;