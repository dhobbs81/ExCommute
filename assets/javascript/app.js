/**
 * @file Provides the main entry point to ExCommute
 * @author Marcus Hobbs
 *
 */

// Execute in strict mode as defined by the ECMAScript version 5 standard
"use strict";

// Attach the main function that will run when the DOM is ready. The JQuery 3.0
// API recommends this usage Other uses are deprecated.
$(main);

/**
 * The main entry point to the ExCommute application.
 * @returns true if there were no critical errors
 */
function main() {

    // This application is entirely event driven. The events include input from
    // the user via text entry and clicks. Other events include database
    // callbacks, map related events, and completion of web API calls.

    // Initialize the database
    // Initialize the web APIs
    // Initialize the UI framework

    //
    // Initialize the map by calling ExCommuteNs.MapNs.initMap()
    // When the map is ready, the mapReady callback is called
    //
    $("body").append(
         "<script async defer src=\"https://maps.googleapis.com/maps/api/js?key=" + ExCommuteNs.getMapApiKey() + "&callback=ExCommuteNs.mapReady&libraries=places\">"
    );

    doDisplay();

    return true;
}

/**
 * Include the ExCommute namespace
 * 
 * If the ExCommuteNs is undefined, then define ExCommuteNs.
 */
var ExCommuteNs = (function (ns) {

    var map = {};
    var params = {};

    ns.showMap = function() {
        ExCommuteNs.MapNs.gotoWorkplace(map);
    }

    ns.setSearchParams = function (searchParams) {
        console.log("TEST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
        console.log(searchParams);
        params = searchParams;
        ExCommuteNs.MapNs.showHouses(map, params.address, params.range);
    }

    ns.mapReadyCallback = function() {

        map = ExCommuteNs.MapNs.initMap(12);
        initAutocomplete();
    }
    return ns;
}(ExCommuteNs || {}));
