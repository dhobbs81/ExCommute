/**
 * @file Provides functionality to retrive housing data from Web APIs
 * @author David Mansen
 */

// Execute in strict mode as defined by the ECMAScript version 5 standard
"use strict";

/**
 * Include the ExCommute namespace
 * 
 * If the ExCommuteNs is undefined, then define ExCommuteNs.
 */
var ExCommuteNs = (function (ns) {
  return ns;
}(ExCommuteNs || {}));

/**
 * Define the ExCommute WebApis namespace
 * 
 * JavaScript Module Pattern: In-Depth
 * See [JS Module Pattern]{@link http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html ModulePattern}
 * 
 * All of the code that runs inside the function lives in a closure, which
 * provides privacy and state throughout the lifetime of our application.
 * 
 * Pass the global jQuery object into the namespace
 */
ExCommuteNs.WebApisNs = (function ($) {
  var ns = {};

  //build house objects from the onboard informatics api call,
  //make calls to zillow to get the price/rent zestimate
  ns.buildHouseObjects = function (housesJSON) {
    var houses = [];

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

  //called to set up ajax request and  set callback
  ns.retrieveHousesByAddress = function (address1, address2, distance, mapCallback) {

    if ( (address1) && (address2) ) {
      var parameters = $.param({
        'address1': address1,
        'address2': address2,
        'radius': distance,
        'orderby': "salesearchdate",
        //'orderby': "distance",
        'pagesize': 25
      });
      console.log("Params: " + parameters);
      ns.retrieveHouses(mapCallback, parameters);
    } 
  }

  //called to set up ajax request and  set callback
  ns.retrieveHouses = function (mapCallback, params) {
    var url = "https://search.onboard-apis.com/propertyapi/v1.0.0/property/address";

    // if (params) {
    //   parameters = $.param({
    //     'address1': params.address1,
    //     'address2': params.address2,
    //     'radius': params.distance,
    //     'orderby': "salesearchdate",
    //     'pagesize': 25
    //   });
    // }
    // else {
    //   parameters = params;
    // }

    url += "?" + params;
    console.log("URL: " + url);

    if (window.localStorage.getItem(url)) {
      console.log("retrieving from cache");
      var cachedHouse = JSON.parse(window.localStorage.getItem(url));
      //console.log(cachedHouse);
      var houses = ns.buildHouseObjects(cachedHouse);
      mapCallback(houses);
    } else {
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
        window.localStorage.setItem(url, JSON.stringify(response));
        var houses = ns.buildHouseObjects(response);
        mapCallback(houses);
      });
    }
  }

  //request zestimate from zillow for each house
  ns.getZestimate = function (house) {
    house.price = Math.floor(Math.random() * 1500) + 500;
    // if(house.price != -1){
    //   console.log("already got the price");
    // }
    // else{
    //   var url = "http://www.zillow.com/webservice/GetSearchResults.htm"
    //
    //   var parameters = $.param({
    //     'zws-id': "X1-ZWz1962gltdszv_4srxq",
    //     'address': house.addr1,
    //     'citystatezip': house.addr2,
    //     'rentzestimate': "true"
    //   });
    //
    //   url+= "?"+parameters;
    //
    //   $.ajax({
    //     type: "GET",
    //     url: url,
    //     dataType: "xml",
    //     success: function(xml) {
    //       console.log(xml);
    //       console.log("price request: ",xml.getElementsByTagName("amount").text());
    //     }
    //   });
    //}

  }

  return ns;
}(jQuery)); // End WebApisNs namespace