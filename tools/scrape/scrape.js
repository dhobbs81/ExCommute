$(document).ready(function(){

  var allHouses = [];

  function writeUserData(zipcode, json) {
    firebase.database().ref('zipcode/' + zipcode).set({
      RAW_JSON: json
    });
  }

  function readData(zipcode, allHouses){
    firebase.database().ref('zipcode/' + zipcode).once('value').then(function(snapshot) {
      var json = snapshot.val();
      var objectString = json.RAW_JSON;
      var houses = JSON.parse(objectString);
      for(let j=0; j<houses.length; j++){
        houses[j].price = Math.floor(Math.random() * 2000) + 400;
        allHouses.push(houses[j]);
      }
    });

  }

  function gatherFromFirebase(){
    var zips = [32801, 32802, 32803, 32804, 32805, 32806, 32807, 32808, 32809,
      32810, 32811, 32812, 32814, 32817, 32818, 32819, 32820, 32821, 32822,
      32824, 32825, 32826, 32827, 32828, 32829, 32830, 32831, 32832, 32833,
      32835, 32836, 32837, 32839, 32856, 32868, 32897];


    for(let i=0; i<zips.length; i++){
      readData(zips[i], allHouses);
    }
  }


  function sortFirebaseArray(){
    firebase.database().ref('zipcode/' + 00000).once('value').then(function(snapshot) {
      var json = snapshot.val();
      var objectString = json.RAW_JSON;
      var houses = JSON.parse(objectString);
      console.log(houses);
      // houses.sort(function(a, b){
      //   var keyA = a.lat,
      //       keyB = b.lat;
      //   // Compare the 2 dates
      //   if(keyA < keyB) return -1;
      //   if(keyA > keyB) return 1;
      //   return 0;
      // });
      // saveFullArray(houses);
    });
  }

  function saveFullArray(houses){
    console.log(JSON.stringify(houses));
    writeUserData(00000, JSON.stringify(houses));
  }

  function shuffleArray(array){
    array.sort(function(){
      return .5 - Math.random();
    });
  }

  function scrape(){
    var zipcodes = [ 32801, 32802, 32803, 32808, 32809, 32812, 32814, 32815, 32817, 32818,
        32804, 32805, 32806, 32807, 32810, 32811, 32816, 32819, 32820, 32821, 32822, 32824,
        32825, 32829, 32830, 32831, 32835, 32836, 32837, 32855, 32856, 32857, 32858, 32859,
        32826, 32827, 32828, 32832, 32833, 32834, 32839, 32853, 32854, 32860, 32861, 32862,
        32867, 32868, 32885, 32886, 32897, 32899, 32869, 32872, 32877, 32878, 32887,
        32891, 32896 ];

    for(let i=54; i<59; i++){
      retrieveHouses(zipcodes[i]);
      console.log("last i:",i);
    }
    console.log(zipcodes.length);
  }


  function retrieveHouses(zipcode){


    var url = "https://search.onboard-apis.com/propertyapi/v1.0.0/property/address";

    var parameters = "";

    parameters = $.param({
      'postalcode': zipcode,
      'orderby': "salesearchdate",
      'page': 1,
      'pagesize': 10000
    });

    url += "?" + parameters;
    console.log("my request " + url);

    //https://search.onboard-apis.com/propertyapi/v1.0.0/property/address?postalcode=32801&propertytype=APARTMENT&orderby=salesearchdate&page=1&pagesize=10000
    //https://search.onboard-apis.com/propertyapi/v1.0.0/property/address?postalcode=82009&propertytype=APARTMENT&orderby=salesearchdate&page=1&pagesize=10000


    console.log("their request ", url);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": url,
      "method": "GET",
      "headers": {
        "apikey": "e497790fddc100419fd40da7adce6d2c",
        "accept": "application/json",
        "cache-control": "no-cache",
        "postman-token": "9a64831b-b44f-501f-b94b-4528059aca82"
      }
    }

      $.ajax(settings).done(function (response) {
        console.log(response);
        cacheResults(response, zipcode);
      });
  }

  function cacheResults(jsonResponse, zip){
    var houses = [];

    for (let i = 0; i < jsonResponse.property.length; i++) {
      var temp = jsonResponse.property[i];
      var house = {
        lat: parseFloat(temp.location.latitude),
        lng: parseFloat(temp.location.longitude),
        addr1: temp.address.line1,
        addr2: temp.address.line2,
        //zip: temp.adddress.postal1,
        address: temp.address.line1 + " " + temp.address.line2,
        price: -1
      };
      houses.push(house);
    }
    shuffleArray(houses);
    var filteredHouses = [];
    for(let i=0; i<houses.length && i<300; i++){
      filteredHouses.push(houses[i]);
    }
    var jsonString = JSON.stringify(filteredHouses);

    //console.log(zip, jsonString);
    writeUserData(zip,jsonString);


  }


  $("#startButtonInner").on("click", gatherFromFirebase);

  $("#doomButton").on("click", sortFirebaseArray);
  //writeUserData(1,"test2");

});





//
//


//
// firebase.initializeApp(config);
// var defaultStorage = firebase.database();
//
// function writeUserData(userId, name) {
//   firebase.database().ref('users/' + userId).set({
//     username: name
//   });
// }
//
// writeUserData(1,"test1");
// process.exit()
