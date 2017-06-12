 $(document).ready(function (){
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
		 		console.log(textClear); //Clear button appears not to be working. Work on that.
		 		console.log(sliderClear);
		 	});
		 	
		 	var search = $("#submit").click(function(){
		 		//insert API function here to fetch results according to filters
		 		if(search){
		 		var map = $("#map");
		 		var mapResult = $("<div>").addClass("row");
		 		$("mapResult").css("height":"100%","width":"100%");
		 		$("mapResult").prepend("#map");
		 		$("map").css("height":"100%","width":"100%");
		 		$("map").show();
		 		$("form").hide();
		 		$("button").hide();
		 		$("h4").hide();
		 		$("h5").hide();

		 	}else{
		 		$("map").hide();
		 		$(".card-panel").hide();

		 	};
		 	});

		 	/*You need to be ready for the CSS to integrate w/ GoogleMaps API properly. 
		 	Highlight selected properties, make markers highly visible and legible. 
		 	Create spaces where additional dialogue info can be displayed, either w/ mouse click or hover.*/
		 	
		 	/*!!COME BACK TO THIS FUNCTION!!       if(){}; */

		 	 //var queryURL = /*insert url base here*/ + /*insert variable here*/ + /*insert API key here*/;
     
        /*!!Ignore the following step. We are hiding the search input after user searches!!*/   	//Make the user input available to view and edit while results are visible. User input will probably also need to be compressible.
        

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

        

	 	 });//End document.ready