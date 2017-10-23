// j'importe ma lib mongoose
var mongoose = require('mongoose');
var User = require('./models/users.js');
var srcListe = require('./data/liste.js');
// je crée mon schema


// je me connecte a la db
// var promise = mongoose.connect('mongodb://localhost:27017/EVAL_JS', {
//   useMongoClient: true,
// });
// // quand la connection est réussie
// promise.then(function(db) {

// 	console.log('db.connected');

	srcListe.forEach(function(userSrc){
		console.log(userSrc);

		var userToSave = new User(userSrc);

		userToSave.save(function(err, success){
			if(err){
				return console.log(err);
				console.log(BLIBLI);
			}
			else{
				console.log(success);
				console.log(BLABLA);
			}
		});
	});

// });