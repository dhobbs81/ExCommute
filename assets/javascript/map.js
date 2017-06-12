/**
 * @file Provides functionality to display housing data on a map 
 * @author Matt Bond
 */

// Execute in strict mode as defined by the ECMAScript version 5 standard
//"use strict";

/**
 * Include the ExCommute namespace
 * 
 * If the ExCommuteNs is undefined, then define ExCommuteNs.
 */
var ExCommuteNs = (function (ns) {
  return ns;
}(ExCommuteNs || {}));

/**
 * Define the ExCommute Map namespace
 * 
 * JavaScript Module Pattern: In-Depth
 * See [JS Module Pattern]{@link http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html ModulePattern}
 * 
 * All of the code that runs inside the function lives in a closure, which
 * provides privacy and state throughout the lifetime of our application.
 * 
 * Pass the global jQuery object into the namespace
 */
ExCommuteNs.MapNs = (function ($) {
  // Define the namespace object
  var ns = {};

  // Include the WebApiNs and give it a shorthand form
  var web = ExCommuteNs.WebApisNs;

  // Not used?  Other key has maps + distance matrix active.
  //var gmapsAPIKey = "AIzaSyAmW7fmoiV52ahfr4s2gmYKVPsv8hEHk0g";
  ///////////////////////////////

  ////////////////
  // Use this!
  var distanceMatrixAPIKey = "AIzaSyACHyy4EKCvJRIlk3KM17nVdZCmltZUTGw";
  /////////////////

  // Define a path to the media assets
  var iconPath = "assets/media/";

  /////////////////
  /////  This will hold the output unchanged from what Google provides
  /////  one origin, workplace.  Up to 25 destinations.
  var distMatrixRaw = [];
  ////////////////

  var workplace = {};
  //	workplace.name = 'UCF Coding Bootcamp';
  //	workplace.lat = 28.589477;
  //	workplace.lng = -81.199993;
  //	workplace.address = '3280 Progress Drive, Orlando, FL';

  // Cache all
  var homes = [];

  // Current block of 25
  var homesCurr = [];

  //////////////////////////
  // Free limit per API request
  var homesLimit = 25; //25
  //////////////////////////

  //////////////////
  /////// map.js:
  // var iconPath = "assets/media/";
  /////////////////

  var iconPath = 'assets/media/';
  var workIcon = iconPath + 'work.png';

  // This callback is linked to the HTML tag and its API key. Just to be sure, I'm
  // defining anything that uses Google Maps libraries inside of this callback.
  ns.prepGMaps = function() {

    console.log('prepGMaps called...');

    $('#workplace-confirm').click(
      function(event) {
        event.preventDefault();
        console.log('Workplace clicked...');
        workplace.name = $('#workplace-name').val();
        workplace.address = $('#workplace-address').val();

        if (haveMap == false) {
          // Spawns a map which only displays the workplace.
          deployMap(workplace);
          haveMap = true;
        }
      }
    );

    $('#homes-confirm').click( function(event) {


        event.preventDefault();
        console.log('Homes button clicked...');

        web.retrieveHouses(housingAPICallback);
      }
    );

    function housingAPICallback(passBackHomes){
      console.log("Pass Back Homes", passBackHomes);
      homesCurr = passBackHomes;
      if (haveMap == true){
        console.log('haveMap==true');
        ns.geoMulti(homesCurr, function() {
          console.log('Going to fire distMatrix...');
          getDistMatrix();
          /* Defer to callbacks of getDistMatrix...
          deployHomes(homes);
          haveHomes = true;  // (But more can be added and statistical rankings are updated each time)
          */
        });
      }
    }

    //  Coding Bootcamp: lat,lng = 28.598107, -81.299277

    ///  Some location code used in google documentation example:
    //var origin1 = new google.maps.LatLng(55.930385, -3.118425);
    //var origin2 = 'Greenwich, England';
    //var destinationA = 'Stockholm, Sweden';
    //var destinationB = new google.maps.LatLng(50.087692, 14.421150);



    function deployMap(work) {
      console.log('Deploy work map now please?');
      //		work.loc = new google.maps.LatLng(work.lat,work.lng);
      //		var geocoder = new google.maps.Geocoder();
      console.log(work.address);
      //		console.log('geocoder object:',geocoder.geocode);

      //	  geocoder.geocode( {'address': work.address}, function(results, status) 

      // Give workplace working lat, lng, and Google loc object
      ns.geo(work, function() {
        if (typeof work.loc !== 'undefined') {
          console.log('Geocoder says location is:', work.loc);
          mapProp = {
            center: work.loc, //new google.maps.LatLng(28.589477, -81.199993),
            zoom: 12
          };

          console.log('Map out workplace:', work.loc);

          map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

          workMarker = new google.maps.Marker({
            position: work.loc,
            map: map,
            icon: workIcon
          });

          $('#workplace-demo').html('I work at: ' + workplace.name + '<br>' + 'Address: ' + workplace.address);
        } else {
          alert('workplace.loc is fubar!!!');
        }

      });
    }

  }

  ns.geo = function(place, callback) {
    // Don't geocode if lat and lng are known. Store as Google loc.
    //console.log("geo function printing",place.lat, typeof(place.lat));
    if (typeof(place.lat) == 'number' && typeof(place.lng) == 'number')
    {
      console.log('lat and lng provided');
      place.loc = new google.maps.LatLng(place.lat, place.lng);
      place.geoFormat = true;
      callback();
    } else if (typeof place.address == 'string') {
      console.log('Looking for lat/lng for', place.address);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': place.address
      }, function(results, status) {
        if (status === 'OK') {
          place.loc = results[0].geometry.location;
          place.lat = place.loc.lat();
          place.lng = place.loc.lng();
          place.geoFormat = true;
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
        callback();
      });
    } else {
      alert(place + 'does not have address or lat/lng');
      callback();
    }
  }

  ns.geoMulti = function(places, callback) {
    console.log('geoMulti...');
    console.log(places.length);

    for (var j = 0; j < places.length; j++) {
      places[j].geoFormat = false;
      console.log(j, 'items set to false...');
      if (j == places.length) {
        callback();
      }
    }

    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      ns.geo(place, function() {
        var locPlace = place;
        console.log(places.indexOf(locPlace), 'vs i:', i, 'vs place:', places.indexOf(locPlace));
        //						locPlace.geoFormat = true;
        console.log('Formatted:', places.filter(function(item) {
          return (item.geoFormat == true);
        }).length);
        if (places.length == places.filter(function(item) {
            return (item.geoFormat == true);
          }).length) {
          callback();
        }
      });
    }
  }
  /////////////////// Outside of google maps initialization

  ns.deployHomes = function(homes) {
    homes.forEach(
      function(home) {
        home.marker = null;
        home.loc = new google.maps.LatLng(home.lat, home.lng);
        //					console.log('Home location:',home.loc);
        //					console.log('Home lat:',home.loc.lat());
        //					console.log('Home lng:',home.loc.lng());
        home.marker = new google.maps.Marker({
          position: home.loc,
          map: map,
          icon: home.icon
        });

        google.maps.event.addListener(home.marker, 'click',
          function() {
            $('.house-ul').html('<li>Address: ' + home.address + '</li>' +
              '<li>Price: $' + home.price + '</li>' +
              '<li>Travel time: ' + Math.floor(home.duration / 60) + 'minutes.</li>');
          }
        );
        //					home.marker

        console.log('Home was logged with icon', home.icon, home);
      }
    )
    homesCurr = [];
  }

  ///  Distance matrix handler:
  function getDistMatrix() {
    var dest = [];
    console.log("HOMESCURR: ",homesCurr);
    homesCurr.forEach(
      function(home) {
        home.loc = new google.maps.LatLng(home.lat, home.lng);
        console.log('Home location:', home.loc);
        console.log('Home lat:', home.loc.lat());
        console.log('Home lng:', home.loc.lng());
        dest.push(home.loc);
      }
    );

    //		var dest =
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [workplace.loc],
        destinations: dest,
        travelMode: 'DRIVING',
        //		    transitOptions: TransitOptions,
        //		    drivingOptions: DrivingOptions,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false,
      },
      distMatrixCallback);
  }

  function distMatrixCallback(response, status) {
    if (status !== 'OK') {
      alert('Crap, Google dist matrix API error:' + status);
    }
    // See Parsing the Results for
    // the basics of a callback function.
    else {
      distMatrixRaw = response;
      var results = response.rows[0].elements;

      homesCurr = homesCurr.filter(function(item, index) {
        if (typeof results[index].duration === 'undefined') {
          console.log('Cannot drive...');
          return false;
        } else {
          item.duration = results[index].duration.value;
          return true;
        }
      });

      console.log('homesCurr:', homesCurr);

    }

    //			console.log('Homes before:',homes);

    homes = homes.concat(homesCurr);

    //			console.log('Homes after:',homes);

    // Use stupid metric if the matrix callback failed...
    setDurationZScores(homes);
    //
    setPriceZScores(homes);
    setDistZScores(homes);

    homeIconPicker(homes);

    // Will remove markers; new data may change relative score of previous queries.
    ns.deployHomes(homes);
    haveHomes = true;

  }

  // Utility functions
  function average(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    if (arr.length > 0) {
      //			console.log ('Average of',arr,'=',sum/arr.length);
      return (sum / arr.length);
    } else {
      console.log('Average of empty sum not defined...');
      return 0;
    }
  }

  function variance(arr) {
    var ssd = 0;
    var mean = average(arr);
    for (var i = 0; i < arr.length; i++) {
      ssd += Math.pow(arr[i] - mean, 2);
    }
    if (arr.length > 1) {
      return ssd / (arr.length - 1);
    } else {
      console.log('Less than two items, std. dev is useless...');
      return 0;
    }
  }

  function stdDev(arr) {
    //		console.log('Standard deviation:',Math.pow(variance(arr),.5));
    return Math.pow(variance(arr), .5);
  }

  // Takes prices, gives houses a "distance z-score" property
  function setPriceZScores(arr) {
    var priceArr = [];
    for (var i = 0; i < arr.length; i++) {
      priceArr.push(arr[i].price);
    }

    var mean = average(priceArr);
    var sd = stdDev(priceArr);
    for (var i = 0; i < arr.length; i++) {
      // Default icon for "typical" home
      arr[i].homeIcon = iconPath + 'home-blue.png';
      if (sd > 0) {
        arr[i].priceZ = (arr[i].price - mean) / sd;
      }
    }
  }

  // Takes houses, gives houses a "distance z-score" property
  function setDistZScores(arr) {
    var distArr = [];
    for (var i = 0; i < arr.length; i++) {
      distArr.push(arr[i].dist);
    }

    var mean = average(distArr);
    var sd = stdDev(distArr);
    for (var i = 0; i < arr.length; i++) {
      if (sd > 0) {
        arr[i].distZ = (arr[i].dist - mean) / sd;
      }
    }
  }


  // Takes houses, gives houses a "distance z-score" property
  function setDurationZScores(arr) {
    var durArr = [];
    for (var i = 0; i < arr.length; i++) {
      durArr.push(arr[i].duration);
    }

    var mean = average(durArr);
    var sd = stdDev(durArr);
    for (var i = 0; i < arr.length; i++) {
      if (sd > 0) {
        arr[i].durationZ = (arr[i].duration - mean) / sd;
      }
    }
  }

  function homeIconPicker(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].priceZ + arr[i].durationZ > 2) {
        arr[i].icon = iconPath + 'home-red.png';
      } else if (arr[i].priceZ + arr[i].durationZ > 1) {
        arr[i].icon = iconPath + 'home-yellow.png';
      } else if (arr[i].priceZ + arr[i].durationZ < -1) {
        arr[i].icon = iconPath + 'home-green.png';
      } else { // default, already set, but just in case...
        arr[i].icon = iconPath + 'home-blue.png';
      }
    }
  }

  return ns;
}(jQuery)); // End MapNs namespace
