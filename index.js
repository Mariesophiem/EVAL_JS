var Particle = require('particle-api-js');
const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Devices = require('./models/devices.js');
var EventsObj = require('./models/eventsObj.js');
var resistorRead = require('./models/resistorRead.js');


var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var Twitter = require('twitter');
var User = require('./models/users.js');
var srcListe = require('./data/liste.js');


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

// je déclare mon dossier qui contient mes vues
app.set('views', './views');
// je déclare mon type de moteur de rendu
app.set('view engine', 'jade');


// serveur web
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html')
});

app.get('/profil', function(req, res) {
    res.sendFile(__dirname + '/client/profil.html')
});

app.post('/particle', function(req, res) {
    console.log("une requete est arrivée");
    console.log(req);
});

app.get('/event-stream.html', function(req, res) {
    res.sendFile(__dirname + '/client/event-stream.html')
});


// configuration des chemins statics
// app.use('/static', express.static('client/static'));
app.use('/js', express.static('./client/static/js'));
app.use('/css', express.static('./client/static/css'));

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
                console.log('BLABLA');
            }
        });
    });

particle.login({
    username: 'mayormaries@gmail.com',
    password: '0501sejas'
}).then(
    function(data) {
        token = data.body.access_token;
        console.log(token);
        console.log('waip waip waip!');
        var devicesPr = particle.listDevices({
            auth: token
        });
        devicesPr.then(
            function(devices) {
                console.log('Devices: ', devices);
                // devices = JSON.parse(devices);
                console.log(devices.body);
                devices.body.forEach(function(device){
                	var toSave = new Devices(device);
                	

                	toSave.save(function(err, success){
                		if(err){
                			console.log(err);
                		}
                		else{
                			console.log('device saved');
                		}
                	})
                });
            },
            function(err) {
                console.log('List devices call failed: ', err);
            }
        );
        //Get your devices events
        particle.getEventStream({
            deviceId: '4b0042000151353532373238',
            auth: token
        }).then(function(stream) {
            stream.on('event', function(data) {
                console.log("Event: " + JSON.stringify(data));
                io.sockets.emit('monsocket', JSON.stringify(data));
            });
        });


        // Lecture de la photorésistance
        // particle.getEventStream({
        //     deviceId: '4e002d000751353530373132',
        //     auth: token

        // }).then(function(stream2) {
        //     stream.on('event2', function(data) {
        //         console.log("Event 2: " + JSON.strigify(data));
        //         io.sockets.emit('monsocket3', JSON.strigify(data));
        //     })
        // });
    },
    function(err) {
        console.log('Could not log in.', err);
    }
);


// API : 
// renvoyer toute la liste des users
app.get('/api/liste', function(req, res) {
    Users.find({}, function(err, collection) {
        if (err) {
            console.log(err);
            return res.send(500);
        } else {
            return res.send(collection);
        }
    });

});


// renvoie un seul user avec son id en param 
app.get('/api/liste/:id', function(req, res) {
    console.log(req.params);
    console.log(req.params.id);
    Users.findOne({
        "_id": req.params.id
    }, function(err, monobject) {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {

            res.send(monobject);
        }
    });


});


// gère les requetes post
app.post('/quotes', function(req, res) {
    console.log(req.body);
    console.log("my name is " + req.body.nom);
    var newUser = {
        nom: req.body.nom,
        prenom: req.body.prenom
    };
    res.send(200);

});
// gère les requetes post
app.post('/new', function(req, res) {
    // console.log(req);
    console.log(req.body);
    console.log("my name is " + req.body.nom);
    // console.log("my name is " + req.body.nom);
    // var newUser = {
    //     nom: req.body.nom,
    //     prenom: req.body.prenom
    // };
    var userToSave = new User(req.body);

    userToSave.save(function(err, success){
            if(err){
                return console.log(err);
            }
            else{
                console.log(success);
                res.send(success);

            }
        });
    
});
// gère la suppression
app.post('/api/delete', function(req, res) {
    console.log(req.body);
    User.findByIdAndRemove(req.body.id,function(err, response){
        if(err){
            console.log(err);
        }
        else{
            console.log(response);
            console.log("deleted");
            res.send(200);

        }
    });
    // console.log("my name is " + req.body.nom);
    // var newUser = {
    //     nom: req.body.nom,
    //     prenom: req.body.prenom
    // };

    
});

// exemple de rendu html / jade
app.put('/api/edit/:id', function(req, res) {
    console.log(req.params);
    console.log(req.body);
    console.log(req.params.id);
    // solution 1 

    // Eleve.update({
    //     "_id": req.params.id
    // },req.body,function(err, response){
    //     if(err){
    //         console.log(err);
    //     }
    //     if(response){
    //         console.log(response);
    //         res.send(200);
    //     }
    // });

    User.findByIdAndUpdate(req.params.id,req.body, { new: true }, function (err, updatedUser) {
      if (err) return handleError(err);
      console.log(updatedUser);
      res.status(200).send(updatedUser);
    });

    // Eleve.findOne({
    //     "_id": req.params.id
    // }, function(err, monobject) {
    //     if (err) {
    //         console.log(err);
    //         return res.send(err);
    //     } else {
    //         return res.render('profil', {
    //             title: 'Hey',
    //             nom: monobject.nom,
    //             prenom: monobject.prenom
    //         });

    //     }
    // });
    // res.send(200);

});