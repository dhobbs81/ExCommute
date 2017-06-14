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

   ns.initMap = function(zoom = 17) {

    var pos = { lat: 28.5881900, lng: -81.1998420 };
    setWorkplacePosition(pos);
    setWorkplaceAddress("2380 Progress Drive, Orlando, FL, 32826");

    var map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: zoom,
      fullscreenControl: true,
      mapTypeControlOptions: {
        //mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
        //        'styled_map']
        mapTypeIds: [ 'styled_map', 'satellite']
      }
    });

    var styledMapType = getMapStyle();

    // Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

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

  function getMapStyle() {

    // Create a new StyledMapType object, passing it an array of styles,
    // and the name to be displayed on the map type control.
    var styledMapType = new google.maps.StyledMapType(
    [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#523735"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c9b2a6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#dcd2be"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ae9e90"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#93817c"
          }
        ]
      },
      {
        "featureType": "poi.attraction",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "weight": 4
          }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          },
          {
            "weight": 2.5
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a5b076"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#447530"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fdfcf8"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f8c967"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#e9bc62"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e98d58"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#db8555"
          }
        ]
      },
      {
        "featureType": "road.local",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#806b63"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8f7d77"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b9d3c2"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#92998d"
          }
        ]
      }
    ],
    { name: 'Road Map' });
    return styledMapType;

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
  var currentWorkplaceAddress = "";
  function setWorkplaceAddress(address) {
    if (address) {
      currentWorkplaceAddress = address;
    }
  }
  function getWorkplaceAddress() {
    return currentWorkplaceAddress;
  }

  var houseMarkers = [];
  ns.showHouses = function(map, address, distance) {

      var commaSeparatedAddress = address.split(",");
      var address1 = commaSeparatedAddress.splice(0, 1);
      var address2 = commaSeparatedAddress.join(",");

      ExCommuteNs.WebApisNs.retrieveHousesByAddress(
        address1,
        address2,
        distance,
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
                      //ExCommuteNs.MapNs.showMarkers(map, houseMarkers);
                    });
                }
            );
        }
    );
  }

  ns.hideHouses = function() {
    ns.hideMarkers(houseMarkers);
  }

  var infowindows = [];

  ns.getMarkers = function(map, locations) {
    var locationMarkers = [];

    locations.forEach(
      function(loc) {
        var pos = new google.maps.LatLng(loc.lat, loc.lng);
        var marker = new google.maps.Marker({
          position: pos,
          title: "house",
          icon: loc.icon,
          animation: google.maps.Animation.DROP,
          map: map
        });

        marker.addListener('click', function() {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
        });

        var driveTimeRoundedMinutes = Math.ceil(loc.duration / 60);

        var contentString = 
          '<div id="iw-container">' +
          '<div class="iw-title">$' + loc.price + '<br>' + driveTimeRoundedMinutes + ' min</div>' +
          //'<div class="iw-content" id="iw-directions">' +
          //'<div class="iw-subTitle">' + loc.duration + '</div>' +
          //'<p>' + driveTimeRoundedMinutes + '</p>' +
          //'<img src="images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
          //'<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
          //'<div class="iw-subTitle">Contacts</div>' +
          //'<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
          //'<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
          //'</div>' +
          '<div class="iw-bottom-gradient"></div>' +
          '</div>';

        var directionsDisplay = new google.maps.DirectionsRenderer();

        var infowindow = new google.maps.InfoWindow({
          content: contentString,
          // Assign a maximum value for the width of the infowindow allows
          // greater control over the various content elements
          maxWidth: 100,
          parentMarker: marker,
          directions: directionsDisplay
        });

        setupInfoWindow(infowindow);

        infowindows.push(infowindow);

        marker.addListener('click', function() {
          infowindows.forEach(function(iw) {
              //iw.directions.setMap(null);
              //iw.directions.setDirections(null);
              iw.directions.setMap(null);
              iw.parentMarker.setAnimation(null);
              iw.close();
          });
          infowindow.open(map, marker);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          
          var options = {
            markerOptions: { visibility: false, opacity: 0.0 },
            preserveViewport: true
          };
          infowindow.directions.setOptions(options);

          infowindow.directions.setMap(map);


          var drivingDirectionsRequest =
          {
            origin: loc.address,
            destination: getWorkplaceAddress(),
            travelMode: 'DRIVING',
            drivingOptions: {
              departureTime: new Date(Date.now() + ((1000 * 60) * 5)),  // for the time N milliseconds from now.
              trafficModel: 'optimistic'
            }
          };

          var directionsService = new google.maps.DirectionsService();
          directionsService.route(drivingDirectionsRequest, function(response, status) {
             if (status == 'OK') {
               infowindow.directions.setDirections(response);
             }
          });

        });

        // Event that closes the Info Window with a click on the map
        google.maps.event.addListener(map, 'click', function() {
          marker.setAnimation(null);
          infowindow.close();
        });


        loc.marker = marker;
        locationMarkers.push(marker);
      }
    );
    return locationMarkers;
  }

  function setupInfoWindow(infowindow) {
    // *
    // START INFOWINDOW CUSTOMIZE.
    // The google.maps.event.addListener() event expects
    // the creation of the infowindow HTML structure 'domready'
    // and before the opening of the infowindow, defined styles are applied.
    // *
    google.maps.event.addListener(infowindow, 'domready', function() {

    // Reference to the DIV that wraps the bottom of infowindow
    var iwOuter = $('.gm-style-iw');

    /* Since this div is in a position prior to .gm-div style-iw.
     * We use jQuery and create a iwBackground variable,
     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
    */
    var iwBackground = iwOuter.prev();

    // Removes background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

    // Removes white background DIV
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

    // Moves the infowindow 115px to the right.
    iwOuter.parent().parent().css({left: '1px'});

    // Moves the shadow of the arrow 76px to the left margin.
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 30px !important;'});

    // Moves the arrow 76px to the left margin.
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 30px !important;'});

    // Changes the desired tail shadow color.
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

    // Reference to the div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
   // iwCloseBtn.css({opacity: '1', right: '50px', top: '10px', border: '5px dotted #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});
    // Apply the desired effect to the close button
    //iwCloseBtn.css({opacity: '1', right: '45px', top: '8px', border: '4px solid #4250f4', 'border-radius': '6px', 'box-shadow': '0 0 5px #3990B9'});
    iwCloseBtn.css({display:'none'});

    $('.iw-bottom-gradient').css({display: 'none'});
    // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
    // if($('.iw-content').height() < 140){
    //   $('.iw-bottom-gradient').css({display: 'none'});
    // }

    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
    // iwCloseBtn.mouseout(function(){
    //   $(this).css({opacity: '1'});
    // });
    });
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

    var place = { address: getWorkplaceAddress() };

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
          var goldStar = {
            path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
            fillColor: 'yellow',
            fillOpacity: 0.8,
            scale: 0.1,
            strokeColor: 'gold',
            strokeWeight: 5
          };

          var posMarker = new google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            icon: goldStar,
            map: map
          });

          // If the map is being drawn, trigger an event to force a redraw
          google.maps.event.trigger(map, 'resize');

          map.panTo(posMarker.getPosition());
          setWorkplacePosition({ lat: place.lat, lng: place.lng });
          setWorkplaceAddress(place.address);

        }
    });
  }

  ns.gotoWorkplace = function (map) {
    console.log("Entered goto Workplace");
    var pos = getWorkplacePosition().getPosition();
    console.log(pos.lat() + ", " + pos.lng());

    var goldStar = {
      path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
      fillColor: 'yellow',
      fillOpacity: 0.8,
      scale: 0.1,
      strokeColor: 'gold',
      strokeWeight: 5
    };

    var posMarker = new google.maps.Marker({
      position: { lat: pos.lat(), lng: pos.lng() },
      icon: goldStar,
      map: map
    });

    // If the map is being drawn, trigger an event to force a redraw
    google.maps.event.trigger(map, 'resize');

    map.panTo(posMarker.getPosition());
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
        arr[i].icon = iconPath + 'redhouse.png';
      } else if (arr[i].priceZ + arr[i].durationZ > 1) {
        arr[i].icon = iconPath + 'yellowhouse.png';
      } else if (arr[i].priceZ + arr[i].durationZ < -1) {
        arr[i].icon = iconPath + 'greenhouse.png';
      } else { // default, already set, but just in case...
        arr[i].icon = iconPath + 'bluehouse.png';
      }
    }
  }

  return ns;
}(jQuery)); // End MapNs namespace
