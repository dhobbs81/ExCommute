/**
 * @file Loads the ExCommute application scripts
 * @author Marcus Hobbs
 */

// Execute in strict mode as defined by the ECMAScript version 5 standard
"use strict";

/**
 * Define the ExCommute application namespace
 * 
 * JavaScript Module Pattern: In-Depth
 * See [JS Module Pattern]{@link http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html ModulePattern}
 * 
 * All of the code that runs inside the function lives in a closure, which
 * provides privacy and state throughout the lifetime of our application.
 * 
 * The namespace can be augmented across files. The global jQuery object is
 * imported into the namespace as the '$' symbol.
 */
var ExCommuteNs = (function (ns) {

	var assetsPath = "assets/";
	var scriptPath = assetsPath + "javascript/";
	var scripts = [
		"webapis.js",
		"map.js",
		"maps-demo.js",
		"display.js",
		"app.js"
	]; 

	ns.includeScript = function(name, path, async = false) {
		var script = document.createElement('script');
		script.onload = function() {
			console.log("Loaded " + name + " script");
		};
		script.src = path;
		// Deferred scripts will be fetched in parallel to the parsing of the HTML
		// document. When the document is parsed, the scripts are executed in order.
		script.setAttribute("defer", "");
		if (async) {
			script.setAttribute("async", "");

		}
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	// 
	// Loads the set of ExCommute scripts
	//
	ns.loadScripts = function() {
		scripts.forEach(function (scriptName) {
			ns.includeScript(scriptName, scriptPath + scriptName);
		});
	}

	//
	// Setup Google Map API and provide callbacks
	//
    ns.mapReadyCallback = function(state) { return state; }
    ns.getMapApiKey = function() { return "AIzaSyACHyy4EKCvJRIlk3KM17nVdZCmltZUTGw"; }
    ns.mapReady = function() {
        console.log("Google Map API initialized!");
        ns.mapReadyCallback({});
    }

	return ns;
}(ExCommuteNs || {}));

//
// Include the Google Maps API
//
// Initialize the map by calling ExCommuteNs.MapNs.initMap()
// When the map is ready, the mapReady callback is called
//
// ExCommuteNs.includeScript("Google Maps API",
// 	"https://maps.googleapis.com/maps/api/js?key=" + ExCommuteNs.getMapApiKey() + "&callback=test>",
// 	//"https://maps.googleapis.com/maps/api/js?key=" + ExCommuteNs.getMapApiKey() + "&callback=ExCommuteNs.mapReady>",
// 	true
// );

// Include the ExCommute scripts
ExCommuteNs.loadScripts();