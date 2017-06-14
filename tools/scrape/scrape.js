var firebase = require("firebase");

var houses = [];
var zipcodes = [ 32801, 32802, 32803, 32808, 32809, 32812, 32814, 32815, 32817, 32818,
    32804, 32805, 32806, 32807, 32810, 32811, 32816, 32819, 32820, 32821, 32822, 32824,
    32825, 32829, 32830, 32831, 32835, 32836, 32837, 32855, 32856, 32857, 32858, 32859,
    32826, 32827, 32828, 32832, 32833, 32834, 32839, 32853, 32854, 32860, 32861, 32862,
    32867, 32868, 32885, 32886, 32897, 32899, 32869, 32872, 32877, 32878, 32887,
    32891, 32896 ];


function retrieveHouses(){
  var url = "https://search.onboard-apis.com/propertyapi/v1.0.0/property/snapshot";

  var parameters = "";

  parameters = $.param({
    'latitude': "10838 Heather Ridge Circle",
    'longitude': "Orlando, FL 32817",
    'radius': 10,
    'orderby': "salesearchdate",
    'propertytype': "APARTMENT",
    'pagesize': 25
  });

  url += "?" + parameters;
  console.log("URL: " + url);


  console.log("Making request to", url);

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
      //console.log(response);
      console.log(response);
      //var houses = ns.buildHouseObjects(response);
    });
}


function houseRequests(){

  console.log(housesJSON.property[0]);

  for (let i = 0; i < housesJSON.property.length; i++) {
    var temp = housesJSON.property[i];
    var house = {
      distance: parseFloat(temp.location.distance),
      lat: parseFloat(temp.location.latitude),
      lng: parseFloat(temp.location.longitude),
      addr1: temp.address.line1,
      addr2: temp.address.line2,
      address: temp.address.line1 + " " + temp.address.line2,
      price: -1
    };
    houses.push(house);
    ns.getZestimate(house);
  }
  console.log(houses);
  return houses;
}

var config = {
    apiKey: "AIzaSyDgjoDG3g3rTUTtpBjaDJormPitnzKEC3M",
    authDomain: "excommute-cd036.firebaseapp.com",
    databaseURL: "https://excommute-cd036.firebaseio.com",
    projectId: "excommute-cd036",
    storageBucket: "excommute-cd036.appspot.com",
    messagingSenderId: "409555167143"
};

firebase.initializeApp(config);
var defaultStorage = firebase.database();

function writeUserData(userId, name) {
  firebase.database().ref('users/' + userId).set({
    username: name
  });
}

writeUserData(1,"test1");
process.exit()
