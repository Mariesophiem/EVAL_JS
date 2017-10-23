var url = window.location;
// je recupere le hashtag 
var userId = url.hash;
// console.log(url);
// console.log("je suis sur la page profil de l'elève avec l'id : " + eleveId);

// console.log(eleveId);

// j'enleve le hashtag pour recuperer l'id en string
userId  = userId.substring(1);
// console.log(typeof eleveId);

// eleveId  = parseFloat(eleveId);
// console.log(typeof eleveId);
console.log(userId);