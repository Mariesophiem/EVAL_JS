var Particle = require('particle-api-js');
const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);


var particle = new Particle();
var token;



// j'instance la connection mongo 
var promise = mongoose.connect('mongodb://localhost:27017/EVAL_JS', {
    useMongoClient: true,
});
// quand la connection est réussie
promise.then(
    () => {
        console.log('db.connected');
        // je démarre mon serveur node sur le port 3000
        server.listen(3000, function() {
            console.log('App listening on port 3000!')
    		io.sockets.on('connection', function (socket) {
	    	console.log("un client est connecté AA");
	    	socket.emit('monsocket2', { hello: "world" });
			});
        });
    },
    err => {
        console.log('MONGO ERROR');
        console.log(err);
    }

);



// prends en charge les requetes du type ("Content-type", "application/x-www-form-urlencoded")
app.use(bodyParser.urlencoded({
    extended: true
}));
// prends en charge les requetes du type ("Content-type", "application/json")
app.use(bodyParser.json());

// serveur web
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html')
});
app.post('/particle', function(req, res) {
    console.log("une requete est arrivée");
    console.log(req);
});

