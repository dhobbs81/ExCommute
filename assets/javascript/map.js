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

  ns.workplace = {};
  //	ns.workplace.name = 'UCF Coding Bootcamp';
  //	ns.workplace.lat = 28.589477;
  //	ns.workplace.lng = -81.199993;
  //	ns.workplace.address = '3280 Progress Drive, Orlando, FL';

  // Cache all
  ns.homes = [];

  // Current block of 25
  ns.homesCurr = [];

  //////////////////////////
  // Free limit per API request
  ns.homesLimit = 25; //25
  //////////////////////////

  //////////////////
  /////// map.js:
  // var iconPath = "assets/media/";
  /////////////////

  var iconPath = 'assets/media/';
  var workIcon = iconPath + 'work.png';

  // Note: This example requires that you consent to location sharing when
  // prompted by your browser. If you see the error "The Geolocation service
  // failed.", it means you probably did not give permission for the browser to
  // locate you.
  // var map, infoWindow;
  ns.initMap = function(zoom = 17) {

    var pos = { lat: 28.5881900, lng: -81.1998420 };
    setWorkplacePosition(pos);

    var map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: zoom,
      fullscreenControl: true
    });

    var infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Got geolocation");
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setWorkplacePosition(pos);
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(map, true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(map, false, infoWindow, map.getCenter());
    }

    // If the window resizes, recenter the map
    google.maps.event.addDomListener(window, 'resize', function() {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
      window.setTimeout(function() {
        console.log(getWorkplacePosition().getPosition().lat() + ", " + getWorkplacePosition().getPosition().lng());
        map.panTo(getWorkplacePosition().getPosition());
     }, 500);
    });

    return map;
  }

  var currentWorkplacePosition = {};
  function getWorkplacePosition() {
    return currentWorkplacePosition;
  }
  function setWorkplacePosition(pos) {
    currentWorkplacePosition = new google.maps.Marker({
      position: { lat: pos.lat, lng: pos.lng }
    });
  }

  function handleLocationError(map, browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    // infoWindow.setContent(browserHasGeolocation ?
    //                       'Error: The Geolocation service failed.' :
    //                       'Error: Your browser doesn\'t support geolocation.');
    // infoWindow.open(map);
  }
  var houseMarkers = [];
  ns.showHouses = function(map) {
      ExCommuteNs.WebApisNs.retrieveHousesByAddress(
        "5676 Century 21 Blvd",
        "Orlando, FL 32807",
        function (houses) {
            console.log("Got a set of houses!");
            ExCommuteNs.MapNs.getCoordsFromAddresses(
                houses,
                function (status) {
                    console.log ("Got the addresses! " + status);

                    getHousesDistances(houses, function(updatedHouses) {

                      setPriceZScores(updatedHouses);
                      setPriceZScores(updatedHouses);
                      setDurationZScores(updatedHouses);
                      homeIconPicker(updatedHouses);

                      houseMarkers = ExCommuteNs.MapNs.getMarkers(map, updatedHouses);
                      ExCommuteNs.MapNs.showMarkers(map, houseMarkers);
                    });
                }
            );
        }
    );
  }

  ns.hideHouses = function() {
    ns.hideMarkers(houseMarkers);
  }

  ns.getMarkers = function(map, locations) {
    var locationMarkers = [];

    locations.forEach(
      function(loc) {
        var pos = new google.maps.LatLng(loc.lat, loc.lng);
        var marker = new google.maps.Marker({
          position: pos,
          title: "house",
          icon: loc.icon
//        icon: icon
        });
        locationMarkers.push(marker);
      }
    );
    return locationMarkers;
  }

  ns.showMarkers = function(map, markers) {
    markers.forEach(
      function(marker) {
        marker.setMap(map);
      }
    );
  }

  ns.hideMarkers = function(markers) {
    markers.forEach(
      function(marker) {
        marker.setMap(null);
      }
    );
  }

  ns.gotoAddress = function(map, address) {

    var place = { address: "2380 Progress Drive, Orlando, FL" };

    if (address) {
      place.address = address;
    }

    console.log("Attempting to pan to address: " + place.address);

    ns.getCoordsFromAddress(place, function(status) {

        if (! status) {
          // throw exception
          console.log("Failed to get geodetic coordinates for address: " + place.address);
        }
        else {

          console.log("Panning to lat: " + place.lat + " lng: " + place.lng);
          var posMarker = new google.maps.Marker({
            position: { lat: place.lat, lng: place.lng }
          });
          map.panTo(posMarker.getPosition());
          setWorkplacePosition({ lat: place.lat, lng: place.lng });
        }
    });
  }

  ns.getCoordsFromAddresses = function(places, returnCoords) {
    var count = 0;
    places.forEach(function (place) { 
      ns.getCoordsFromAddress(place, function(status) {
        console.log ("Got location: " + place.lat + ", " + place.lng + " for address: " + place.address);
        count++;
        if (count == places.length) {
          returnCoords(true);
        }
      });
    });
  }

  ns.getCoordsFromAddress = function(place, returnCoords) {
    // Don't geocode if lat and lng are known. Store as Google loc.
    //console.log("geo function printing",place.lat, typeof(place.lat));
    if (typeof(place.lat) == 'number' && typeof(place.lng) == 'number')
    {
      console.log('lat and lng provided');
      place.loc = new google.maps.LatLng(place.lat, place.lng);
      place.geoFormat = true;
      returnCoords(true);
    } 
    else if (typeof place.address == 'string') {
      console.log('Looking for lat/lng for', place.address);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': place.address
      }, 
      function(results, status) 
      {
        if (status === 'OK') {
          place.loc = results[0].geometry.location;
          place.lat = place.loc.lat();
          place.lng = place.loc.lng();
          place.geoFormat = true;
          returnCoords(true);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
          returnCoords(false);
        }
      });
    }
    else {
      console.log(place + 'does not have address or lat/lng');
      returnCoords(false);
    }
  }

  ///  Distance matrix handler:
  function getHousesDistances(houses, gotDistancesCallback) {
    var dest = [];
    houses.forEach(
      function(house) {
        house.loc = new google.maps.LatLng(house.lat, house.lng);
        console.log('House location:', house.loc);
        console.log('House lat:', house.loc.lat());
        console.log('House lng:', house.loc.lng());
        dest.push(house.loc);
      }
    );

    var wp = getWorkplacePosition();
    var wpLoc = new google.maps.LatLng(wp.getPosition().lat(), wp.getPosition().lng());

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [wpLoc],
        destinations: dest,
        travelMode: 'DRIVING',
        //		    transitOptions: TransitOptions,
        //		    drivingOptions: DrivingOptions,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false,
      },
      // This callback is called when the distance service finishes
      function (response, status) {
          var results = response.rows[0].elements;
          var filteredHouses = houses.filter(function(item, index) {
            if (typeof results[index].duration === 'undefined') {
              console.log('Cannot drive...');
              return false;
            } else {
              item.duration = results[index].duration.value;
              return true;
            }
          });
          gotDistancesCallback(filteredHouses);
          //console.log('homesCurr:', ns.homesCurr);
      });
  }

  // This callback is linked to the HTML tag and its API key. Just to be sure, I'm
  // defining anything that uses Google Maps libraries inside of this callback.
  ns.prepGMaps = function() {

    console.log('prepGMaps called...');

    // 
    // Gather workplace information
    // Initialize the map
    //

    $('#workplace-confirm').click(
      function(event) {
        event.preventDefault();
        console.log('Workplace clicked...');
        ns.workplace.name = $('#workplace-name').val();
        ns.workplace.address = $('#workplace-address').val();

        if (haveMap == false) {
          // Spawns a map which only displays the workplace.
          deployMap(ns.workplace);
          haveMap = true;
        }
      }
    );

    // $('#homes-confirm').click( function(event) {


    //     event.preventDefault();
    //     console.log('Homes button clicked...');

    //     web.retrieveHouses(housingAPICallback);
    //   }
    // );

    // function housingAPICallback(passBackHomes){
    //   console.log("Pass Back Homes", passBackHomes);
    //   ns.homesCurr = passBackHomes;
    //   if (haveMap == true){
    //     console.log('haveMap==true');
    //     ns.geoMulti(ns.homesCurr, function() {
    //       console.log('Going to fire distMatrix...');
    //       getDistMatrix();
    //       /* Defer to callbacks of getDistMatrix...
    //       deployHomes(homes);
    //       haveHomes = true;  // (But more can be added and statistical rankings are updated each time)
    //       */
    //     });
    //   }
    // }

    //  Coding Bootcamp: lat,lng = 28.598107, -81.299277

    ///  Some location code used in google documentation example:
    //var origin1 = new google.maps.LatLng(55.930385, -3.118425);
    //var origin2 = 'Greenwich, England';
    //var destinationA = 'Stockholm, Sweden';
    //var destinationB = new google.maps.LatLng(50.087692, 14.421150);

    var placeSearch, autocomplete;
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    function initAutocomplete() {
      // Create the autocomplete object, restricting the search to geographical
      // location types.
      autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
          types: ['geocode']
        });

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete.addListener('place_changed', fillInAddress);
    }

    function fillInAddress() {
      // Get the place details from the autocomplete object.
      var place = autocomplete.getPlace();

      for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
      }

      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          document.getElementById(addressType).value = val;
        }
      }
    }

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          autocomplete.setBounds(circle.getBounds());
        });
      }
    }

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

          $('#workplace-demo').html('I work at: ' + ns.workplace.name + '<br>' + 'Address: ' + ns.workplace.address);
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
    ns.homesCurr = [];
  }

  ///  Distance matrix handler:
  function getDistMatrix() {
    var dest = [];
    console.log("HOMESCURR: ", ns.homesCurr);
    ns.homesCurr.forEach(
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
        origins: [ns.workplace.loc],
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

      ns.homesCurr = ns.homesCurr.filter(function(item, index) {
        if (typeof results[index].duration === 'undefined') {
          console.log('Cannot drive...');
          return false;
        } else {
          item.duration = results[index].duration.value;
          return true;
        }
      });

      console.log('homesCurr:', ns.homesCurr);

    }

    //			console.log('Homes before:',homes);

    ns.homes = ns.homes.concat(ns.homesCurr);

    //			console.log('Homes after:',homes);

    // Use stupid metric if the matrix callback failed...
    setDurationZScores(ns.homes);
    //
    setPriceZScores(ns.homes);
    setDistZScores(ns.homes);

    homeIconPicker(ns.homes);

    // Will remove markers; new data may change relative score of previous queries.
    ns.deployHomes(ns.homes);
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
