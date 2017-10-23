var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	'nom' : String,
	'prenom' : String,
	'age' : Number,
	'createdAt' : Date,
});
