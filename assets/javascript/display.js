 $(document).ready(function() {//Sniff around for scope conflicts and issues. They can't hide forever...
 function doDisplay() {

 			console.log("Entered doDisplay");

			 /*The dialogue interacting w/ user*/
		 	var dialogueDropdown = $('.dropdown-button').dropdown({
			      inDuration: 300,
			      outDuration: 225,
			      constrainWidth: false, // Does not change width of dropdown to that of the activator
			      hover: true, // Activate on hover
			      gutter: 0, // Spacing from edge
			      belowOrigin: false, // Displays dropdown below the button
			      alignment: 'left', // Displays dropdown with edge aligned to the left of button
			      stopPropagation: false // Stops event propagation
				});	//end dialogueDropdown
		 	var dropdownHeader = $("");
		 	var dropdownBody = $("");
		 	/*To use these inline you have to add them as data attributes. If you want more dynamic control, you can define them using the jQuery plugin below. */
		 	var dropAHouseOnYou = $("#map-display").click(function(){

		 	});
		 	var clearAll = $("#clear").click(function(){
		 		var textClear = $("input").empty();
		 		//var sliderClear = $(".input-range").empty();
		 		var slider = document.getElementById("test5");
		 		var sliderDefault = $("slider").val;
		 		//var sliderCurrent = $("slider").val;
		 		var sliderCurrent = $("slider").focus(function(){
		 			if (sliderDefault !== sliderCurrent){
		 			var sliderClear = $("#clear").click(function(){
	 					sliderCurrent = 50;
		 			});
		 		};
		 		
		 		});
		 		var sliderClear = $(".input-range").empty();
		 		console.log(textClear); //Clear button appears not to be working. Work on that.
		 		console.log(sliderClear);
		 	});

	 		$("#map").hide();
	 		$(".card-panel").hide();

		 	$("#submit").click(function(){
		 		//insert API function here to fetch results according to filters
		 		var map = $("#map");
		 		var mapResult = $("<div>").addClass("row");
		 		$("mapResult").css({"height":"100%","width":"100%"});
		 		$("mapResult").prepend("#map");
		 		$("map").css({"height":"100%","width":"100%"});
		 		$("map").show();
		 		$("form").hide();
		 		$("button").hide();
		 		$("h4").hide();
		 		$("h5").hide();
		 		$("")
		 	});

		 	//This can display GoogleMaps options.
		 	function myMap() {
   				var mapCanvas = document.getElementById("map");
    			var mapOptions = {
        				center: new google.maps.LatLng(51.5, -0.2),
       					zoom: 10
    			};
    			var mapLetOurPowersCombine = new google.maps.Map(mapCanvas, mapOptions);
			};

			function houseInfo () {
				var house = $(/*Insert API representing map markers here*/);
				var infoPopup = $("house").click(function(){
					var cardRow = $("<div>").addClass("row");
					var cardColumn = $("<div>").addClass("col s12 m5");
					var cardRowWithColumn = $("cardRow").append("cardColumn");
					var cardPanel = $("<div>").addClass("card-panel teal");
					var cardColumnWithPanel = $("cardColumn").append("cardPanel");
					var cardInfo = $("<span>").addClass("white-text");
					var cardPanelWithInfo = $("cardPanel").append("cardInfo"); 
					//You'll need to insert API for information on the clicked house. Be sure to add arbitrary color coding.
				});
			};

			function colorCode () {
				var distance = /*Grab some API which will calculate distance between selected house and work address.*/
				//Watch out for scope! Some of your variables are local variables from the previous function!
				var cardRow = $("<div>").addClass("row");
				var cardColumn = $("<div>").addClass("col s12 m5");
				var cardRowWithColumn = $("cardRow").append("cardColumn");
				var cardPanel = $("<div>").addClass("card-panel teal");
				var cardColumnWithPanel = $("cardColumn").append("cardPanel");
				var cardInfo = $("<span>").addClass("white-text");
				var cardPanelWithInfo = $("cardPanel").append("cardInfo"); 
				if(distance =< 5){
					$("cardPanel").css("border":"2px solid green");
					$("cardPanelWithInfo").append("a short commute to work");
				};
				else if(5 < distance && distance < 15){
					$("cardPanel").css("border":"2px solid yellow");
					$("cardPanelWithInfo").append("a fairly distant commute to work");
				};
				else{
					$("cardPanel").css("border":"2px solid red");
					$("cardPanelWithInfo").append("a long commute to work");
				};
			};
		 	/*You need to be ready for the CSS to integrate w/ GoogleMaps API properly. 
		 	Highlight selected properties, make markers highly visible and legible. 
		 	Create spaces where additional dialogue info can be displayed, either w/ mouse click or hover.*/
		 	
		 	/*!!COME BACK TO THIS FUNCTION!!       if(){}; */

		 	 //var queryURL = /*insert url base here*/ + /*insert variable here*/ + /*insert API key here*/;
     
        /*!!IGNORE THE FOLLOWING STEP. We are hiding the search input after user searches!!*/   	
        	//Make the user input available to view and edit while results are visible. User input will probably also need to be compressible.
        

	        //if($("map").show()){
	        	//$("#user-input").css({"float":"top", "height":"0.5em", "width":"0.5em"});
	       // };//Now how do we expand and contract our user-input form while the map is on display?
	        
	        /*var editInput = function(){
	        	var editMessage = $("h3").html("You can edit your filters by clicking here!");
	        	var editExpand = $("button");
	        	$("editExpandCommand").create(editMessage);
	        	$("editExpandCommand").css({float:right});
	        	var editExpandAccomplished = $("editExpandCommand").click(function(){
	        		$("#user-input").css({"height":"0.5em", "width":"0.5em", "float":"right"});//.css() methods do not follow CSS stylesheet rules. No semicolons, and always quote your CSS elements and properties.
	        		    });
	        	var editContract = function(){
	        		if $("editExpandAccomplished"){

	        		};
	        	};
	        };*/
	 	
	 	/*You need to be ready for the CSS to integrate w/ GoogleMaps API properly. 
	 	Highlight selected properties, make markers highly visible and legible. 
	 	Create spaces where additional dialogue info can be displayed, either w/ mouse click or hover.*/
	 	var map = $("#map");

	 	 //var queryURL = /*insert url base here*/ + /*insert variable here*/ + /*insert API key here*/;
     
        /*!!IGNORE THE FOLLOWING STEP. We are hiding the search input after user searches!!*/ 
        	//Make the user input available to view and edit while results are visible. User input will probably also need to be compressible.
        /*
        if($("map").show()){
        	$("#user-input").show();
        	$("#user-input").css({float:"top"});
        }
        else {
        	$("#user-input").hide();        
       };
      */

        var editInput = function(){
        	var editMessage = $("h3").html("You can edit your filters by clicking here!");
        	var editExpand = $("button");
        	$("editExpand").create(editMessage);
        	$("editExpand").css({float:right});
        	$("editExpand").click(function() {
        		$("#user-input").css({height:"0.5em", width: "0.5em", float:"right"});
        	});
        };
        

for (let i = 5; i < 20; i++) {
    $("#price-select").append("<option value=" + i * 100 + ">$" + i * 100 + "</option>");
  }

  $('select').material_select();
});


$("#search-button").on("click", function() {
  $("#onboard-card").slideUp("fast");
  $("#search-card").fadeIn("fast");
});

$("#submit-button").on("click", function() {
  $("#entry-page").slideUp("fast");
  $("#main-page").fadeIn("fast", function() {
    var params = {};
    params.address = $("#autocomplete").val().trim();
    //var selectval = document.getElementById("range-select").value;
    params.range = $("#range-select").val();
    params.price = $("#price-select option:selected").text();
    ExCommuteNs.setSearchParams(params);
    ExCommuteNs.showMap();
  });
});


function initMap() {
  var uluru = {
    lat: -25.363,
    lng: 131.044
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}



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
}
