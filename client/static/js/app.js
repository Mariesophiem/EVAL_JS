// je crée un tb vide pour stocker mes données
var data = [];
var newO = {};
var editMode = {
    edit: false,
    editId: undefined
};
// 1 : gérer la récupération de données
// je crée mon objet requete 
var marequete = new XMLHttpRequest();
// j'ouvre une requete get
marequete.open('GET', "http://localhost:3000/api/liste", true);
// je lanche ma requete
marequete.send();

// on écoute ce qu'il se passe
marequete.addEventListener("readystatechange", processRequest, false);
// callback de ma requete http
function processRequest(event) {
    console.log(event);
    console.log(marequete.readyState);
    console.log(marequete.status);
    // console.log(event);

    if (marequete.readyState == 4 && marequete.status == 200) {
        // var mareponse = marequete.response;
        var mareponseText = marequete.responseText;
        // parser la reponse texte en json 
        mareponseText = JSON.parse(mareponseText);
        // appel la fonction bindlist avec la réponse en param

        // stocker le tableau dans la variable data
        data = mareponseText;
        data.forEach(function(user) {
            bindList(user);

        });
        // console.log(mareponse);
    }

}


// données récupérées

// créer element liste
var monUl = document.createElement("ul");
// ajout classe list-group
monUl.classList.add("list-group")
    // retrouver le wrap principal
var monWrap = document.getElementById("wrap");

// ajout le ul au wrap
monWrap.appendChild(monUl);


// gérer le toggle au click sur le bouton pour faire apparaitre le formulaire
var monBtn = document.getElementById("addNew");
monBtn.addEventListener("click", function(event) {
    document.getElementById("myForm").classList.toggle("show");

});

// faire le traitement sur le tableau de données récupérées (création du li et ajout au ul)

// bind chaque element dans la liste ul
function bindList(user) {
    // créer l'element li
    var monLi = document.createElement("li");
    // remplir le contenu du li
    monLi.innerHTML = user.nom + ' ' + user.prenom;
    // ajout class
    monLi.classList.add("list-group-item");
    // mettre en data- l'_id de l'élève pour pouvoir le retrouver
    monLi.setAttribute("data-idUser", user._id);
    monLi.setAttribute("data-objUser", JSON.stringify(user));

    // ajout btn profile
    addBtnProfile(monLi);
    // ajout btn delete
    addBtnDelete(monLi);
    // ajout btn edit
    addBtnEdit(monLi);


    // monLi.appendChild(deleteBtn);
    monUl.appendChild(monLi);
}


// fonctions d'ajout des bouttons
function addBtnProfile(elem) {
    var btnProfile = document.createElement("span");
    btnProfile.classList.add("badge")
    btnProfile.innerHTML = "<span class='glyphicon glyphicon-user' aria-hidden='true'></span>";
    btnProfile.addEventListener("click", detectClick);
    elem.appendChild(btnProfile);
}

function addBtnDelete(elem) {
    var deleteBtn = document.createElement("span");
    deleteBtn.classList.add("badge")
    deleteBtn.innerHTML = "<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>";
    deleteBtn.addEventListener("click", deleteUser);
    elem.appendChild(deleteBtn);
}

function addBtnEdit(elem) {
    var deleteEdit = document.createElement("span");
    deleteEdit.classList.add("badge")
    deleteEdit.innerHTML = "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>";
    deleteEdit.addEventListener("click", editUser);
    elem.appendChild(deleteEdit);
}



// detect le click sur chaque btn profile
function detectClick(event) {
    event.preventDefault();
    // console.log(this);
    console.log(event);
    console.log(event.target);
    var myTarget = event.target.parentNode.parentNode;
    console.log(myTarget);
    var userId = myTarget.getAttribute("data-idUser");
    console.log(userId);

    window.location = "./profil" + '#' + myTarget.getAttribute("data-idUser");
}


// fonction qui gère le formulaire
function submitForm(event) {
    // event.preventDefault();
    console.log("submitted");

    // je recupere tous les elements du formulaire
    var monForm = document.getElementById("newUser").elements;
    // je crée l'objet a envoyer au server
    var newUser = {};

    // monform est un objet, j'utilise la methode .forIn de lodash pour itérer sur chaque clé et assigner une (clé, valeur) )à mon new user
    _.forIn(monForm, function(item) {

        if (item.value) {
                console.log(item.name);

                console.log(item.value);
                // ex : newUser.nom = "leo"
                newUser[item.name] = item.value;
        }
        

    });
    // si je suis en mode creation, alors je crée un nouvel objet
    if (editMode.edit === false) {
        console.log("je suis en création");

        // je vérifie le newUser avant de l'envoyer
        console.log(newUser);
        // je crée ma nouvelle requete post pour envoyer
        var postUser = new XMLHttpRequest();
        // j'ouvre une requete post vers la bonne aPI
        postUser.open('POST', "http://localhost:3000/new", true);
        // je lanche ma requete

        // postUser.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        // je set le header de ma requete pour lui dire que j'envoie du json
        postUser.setRequestHeader("Content-type", "application/json");

        // // je send ma requete en transformant mon newUser en string
        postUser.send(JSON.stringify(newUser));

        // j'écoute que la requete soient bien finie pour log l'information 
        postUser.onreadystatechange = function() { //Call a function when the state changes.
            if (postUser.readyState == XMLHttpRequest.DONE && postUser.status == 200) {
                // Request finished. Do processing here.
                console.log('req ok');
                console.log(postUser.responseText);
                var addUser = JSON.parse(postUser.responseText);
                var addUser = bindList(addUser);

            }
        }
    }
    // si je suis en mode edition, j'update l'objet
    else if (editMode.edit === true) {
        console.log("je suis en edition");
        console.log(editMode);
        console.log(newUser);
        newUser._id = editMode.editId;
         
        var editUser = new XMLHttpRequest();
        // j'ouvre une requete post vers la bonne aPI
        editUser.open('PUT', "http://localhost:3000/api/edit/" + editMode.editId, true);
        // je lanche ma requete

        // editUser.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        // je set le header de ma requete pour lui dire que j'envoie du json
        editUser.setRequestHeader("Content-type", "application/json");

        // // je send ma requete en transformant mon newUser en string
        editUser.send(JSON.stringify(newUser));

        // j'écoute que la requete soient bien finie pour log l'information 
        editUser.onreadystatechange = function() { //Call a function when the state changes.
            if (editUser.readyState == XMLHttpRequest.DONE && editUser.status == 200) {
                // Request finished. Do processing here.
                console.log('req ok');
                console.log(editUser.responseText);
                // console.log(editUser.responseText);
                var editedUser = JSON.parse(editUser.responseText);
                console.log(editedUser);
                // var addEleve = bindList(addEleve);

            }
        }

    }



};

// supprimer un user
function deleteUser(event) {
    event.preventDefault();
    console.log("delete");
    console.log(event);
    console.log(event.target);
    var myTarget = event.target.parentNode.parentNode;
    console.log(myTarget);
    var userId = myTarget.getAttribute("data-iduser");
    console.log(userId)
    var idObj = {
        id: userId
    };


    var deleteUser = new XMLHttpRequest();
    // j'ouvre une requete post vers la bonne aPI
    deleteUser.open('POST', "http://localhost:3000/api/delete", true);
    // je lanche ma requete

    // deleteUser.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // je set le header de ma requete pour lui dire que j'envoie du json
    deleteUser.setRequestHeader("Content-type", "application/json");

    // // je send ma requete en transformant mon newUser en string
    deleteUser.send(JSON.stringify(idObj));

    // j'écoute que la requete soient bien finie pour log l'information 
    deleteUser.onreadystatechange = function() { //Call a function when the state changes.
            if (deleteUser.readyState == XMLHttpRequest.DONE && deleteUser.status == 200) {
                // Request finished. Do processing here.
                console.log('req ok');
                myTarget.remove();
                // console.log(postUser.responseText);
                // var addEleve = JSON.parse(postUser.responseText);
                // var addEleve = bindList(addEleve);

            }
        }
        // var myIndex = data.findIndex(function(i) {
        //     return i.id === eleveId
        // });
        // data.splice(myIndex, 1);
        // removeElem(myTarget);
        // console.log(myIndex);

    // // je cherche l'eleve correspondant a l'index
    // var monuser = dataList[myIndex];
    // console.log(monuser);

};

// editer un User
function editUser(event) {
    console.log("edit");

    document.getElementById("myForm").classList.toggle("show");
    var myTarget = event.target.parentNode.parentNode;
    console.log(myTarget);
    var objUser = myTarget.getAttribute("data-objUser");
    editMode.edit = true;
    editMode.editId = myTarget.getAttribute("data-idUser");

    console.log(objUser);
    objUser = JSON.parse(objUser);
    console.log(objUser._id);
    // var myIndex = data.findIndex(function(i) {
    //     return i._id === eleveId;
    // });
    // console.log(myIndex);
    var monForm = document.getElementById("newUser").elements;
    _.forIn(monForm, function(item) {
        // console.log(item.value);
        // console.log(item.name);
        item.value = objUser[item.name];
        // newUser[item.name] = item.value;

    });



};