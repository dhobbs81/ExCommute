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
		 		var sliderClear = $(".input-range").empty();
		 		console.log(textClear); //Clear button appears not to be working. Work on that.
		 		console.log(sliderClear);
		 	});
		 	
		 	
		 	/*You need to be ready for the CSS to integrate w/ GoogleMaps API properly. 
		 	Highlight selected properties, make markers highly visible and legible. 
		 	Create spaces where additional dialogue info can be displayed, either w/ mouse click or hover.*/
		 	var map = $("#map");

		 	 //var queryURL = /*insert url base here*/ + /*insert variable here*/ + /*insert API key here*/;
     
        //Make the user input available to view and edit while results are visible. User input will probably also need to be compressible.
        if($("map").show()){
        	$("#user-input").show();
        	$("#user-input").css({float:"top"});
        }else {
        	$("#user-input").hide();

        };//Now how do we expand and contract our user-input form while the map is on display?
        var editInput = function(){
        	var editMessage = $("h3").html("You can edit your filters by clicking here!");
        	var editExpand = $("button");
        	$("editExpand").create(editMessage);
        	$("editExpand").css({float:right});
        	$("editExpand").click(function{
        		$("#user-input").css({height:0.5em; width: 0.5em; float:right});
        		});
        };
        

	 	 });//End document.ready