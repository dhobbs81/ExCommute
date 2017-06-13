var firebase = require("firebase");

var houses = [];
var zipcodes = [ 32801, 32802, 32803, 32808, 32809, 32812, 32814, 32815, 32817, 32818,
    32804, 32805, 32806, 32807, 32810, 32811, 32816, 32819, 32820, 32821, 32822, 32824,
    32825, 32829, 32830, 32831, 32835, 32836, 32837, 32855, 32856, 32857, 32858, 32859,
    32826, 32827, 32828, 32832, 32833, 32834, 32839, 32853, 32854, 32860, 32861, 32862,
    32867, 32868, 32885, 32886, 32897, 32899, 32869, 32872, 32877, 32878, 32887,
    32891, 32896 ];

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
