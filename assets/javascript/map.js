// Not used?  Other key has maps + distance matrix active.
//var gmapsAPIKey = "AIzaSyAmW7fmoiV52ahfr4s2gmYKVPsv8hEHk0g";
///////////////////////////////

////////////////
// Use this!
var distanceMatrixAPIKey = "AIzaSyACHyy4EKCvJRIlk3KM17nVdZCmltZUTGw";
/////////////////

var iconPath = "assets/media/";

var distMatrixRaw = [];


// This callback is linked to the HTML tag and its API key.  Just to be sure, I'm defining anything that uses Google Maps libraries inside of this callback.

function prepGMaps() {

	console.log('prepGMaps called...');

		$('#workplace-confirm').click(
			function(event)
				{
					event.preventDefault();
					console.log('Workplace click...');
					workplace.name = $('#workplace-name').val();
					workplace.address = $('#workplace-address').val();

					if(haveMap == false) 
						{			
							// Spawns a map which only displays the workplace.		
							deployMap(workplace);
							haveMap = true;
						}
				}
			);

		$('#homes-confirm').click(
			function(event)
				{
					///// This should not be used in the finished product....
					fakeHousesForSale(workplace);
					////

					event.preventDefault();					
					console.log('Homes button click...');
					if(haveMap == true)
						// Below would prevent you from starting over...
//					if(haveHomes == false && haveMap == true)
						{
							setDurationZScores(homes);
							setPriceZScores(homes);
							setDistZScores(homes);

							getDistMatrix();
							/* Defer to callbacks of getDistMatrix...
							deployHomes(homes);
							haveHomes = true;

								Code should probably allow more calls to be appended?  But it's taking a long time just to refactor and combine code...
							*/
						}
				}
			);


//  Coding Bootcamp: lat,lng = 28.598107, -81.299277


///  Some location code used in google documentation example:
//var origin1 = new google.maps.LatLng(55.930385, -3.118425);
//var origin2 = 'Greenwich, England';
//var destinationA = 'Stockholm, Sweden';
//var destinationB = new google.maps.LatLng(50.087692, 14.421150);



// priceZ and distZ will hold z-scores for those values now.
//  THE BELOW DEPENDS ON THE STATISTICS FOR THE ENTIRE ARRAY, AND THEREFORE CANNOT BE
//  COMPUTED INSIDE OF THE FOR LOOP


// Depends on the z-scores...




function deployMap(work)
	{
		console.log('Deploy work map now please?');
//		work.loc = new google.maps.LatLng(work.lat,work.lng);
		var geocoder = new google.maps.Geocoder();
		console.log(work.address);
		console.log('geocoder object:',geocoder.geocode);

//		geocoder.
	  geocoder.geocode( {'address': work.address}, function(results, status) {
		     if (status === 'OK')
		     {
		     	console.log('Geocoder says ok!');
		      	work.loc = results[0].geometry.location;
		      	work.lat = work.loc.lat();
		      	work.lng = work.loc.lng();

		      	console.log('Geocoder says location is:',work.loc);
		     	//		workplace.loc = new 
				mapProp= 
				{
			    	center: work.loc, //new google.maps.LatLng(28.589477, -81.199993),
			    	zoom:12
				};		

				console.log('Map out workplace:',work.loc);

				map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
				

				workMarker = new google.maps.Marker({
					position: work.loc,
					map: map,
					icon: workIcon
				});

		      		//Google geocoder example
		//        map.setCenter(results[0].geometry.location);
		  //      var marker = new google.maps.Marker({
		    //        map: map,
		      //      position: results[0].geometry.location
		//        });
		      } 

		      else { alert('Geocode was not successful for the following reason: ' + status); }
		    }); 



  // Zoom to 9 when clicking on marker
/*
  google.maps.event.addListener(marker,'click',function() {
    map.setZoom(9);
    map.setCenter(marker.getPosition());
  });
  */
	}


}

/////////////////// Outside of google maps initialization

function deployHomes(homes)
	{


		homes.forEach(
				function(home)
				{
					home.loc = new google.maps.LatLng(home.lat,home.lng);
//					console.log('Home location:',home.loc);
//					console.log('Home lat:',home.loc.lat());
//					console.log('Home lng:',home.loc.lng());
					home.marker = new google.maps.Marker({
						position:home.loc,
						map: map,
						icon: home.icon
					});

					google.maps.event.addListener(home.marker,'click',
						function() 
							{
								$('.house-ul').html('<li>Price: ' + home.price + '</li>' +
														'<li>Distance: ' + home.dist + '</li>');
							}
						);
//					home.marker

					console.log('Home was logged with icon',home.icon,home);
				}


			)



	}




///  Distance matrix handler:

/////  This will hold the output unchanged from what Google provices

function getDistMatrix()
	{
		var dest = [];
		homes.forEach(
		function(home)
			{
				home.loc = new google.maps.LatLng(home.lat,home.lng);
				console.log('Home location:',home.loc);
				console.log('Home lat:',home.loc.lat());
				console.log('Home lng:',home.loc.lng());
				dest.push(home.loc);
			}
		);

//		var dest = 
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix(
		  {
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

function distMatrixCallback(response, status)
	{
		if(status !== 'OK') { alert('Crap, Google dist matrix API error:' + status);}
		  // See Parsing the Results for
		  // the basics of a callback function.
		else
			{
				distMatrixRaw = response;
            var results = response.rows[0].elements;				

			for(var j=0; j<homes.length; j++)
//				                outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
				{
						// time in seconds
					homes[j].duration = results[j].duration.value;
/*					console.log(results[j]);
					console.log(results[j].duration);
					console.log(results[j].duration.value);  */

				}
//                    ': ' + results[j].distance.text + ' in ' +
//                    results[j].duration.text + '<br>';

			}

			// Use stupid metric if the matrix callback failed...
			setDurationZScores(homes);
			homeIconPicker(homes);
			deployHomes(homes);
			haveHomes = true;

	}







// Utility functions

function average(arr)
	{
		var sum = 0;
		for(var i=0;i<arr.length;i++)
			{	
				sum += arr[i];
			}
		if(arr.length>0)
		{
//			console.log ('Average of',arr,'=',sum/arr.length);
			return (sum/arr.length);
		}
		else
			{	console.log('Average of empty sum not defined...');
				return 0; }
	}


function variance(arr)
	{
		var ssd = 0;
		var mean = average(arr);
		for(var i=0; i<arr.length; i++)
			{	
				ssd += Math.pow(arr[i]-mean,2);
			}
		if(arr.length>1)
			{
				return ssd/(arr.length-1);	
			}
		else
			{	
				console.log('Less than two items, std. dev is useless...');
				return 0;
			}
	}

function stdDev(arr)
	{
//		console.log('Standard deviation:',Math.pow(variance(arr),.5));
		return Math.pow(variance(arr),.5);
	}

// Takes prices, gives houses a "distance z-score" property
function setPriceZScores(arr)
	{
		var priceArr = [];
		for (var i=0;i<arr.length;i++)
			{
				priceArr.push(arr[i].price);
			}

		var mean = average(priceArr);
		var sd = stdDev(priceArr);
		for (var i=0;i<arr.length;i++)
		{
			// Default icon for "typical" home
			arr[i].homeIcon =iconPath + 'home-blue.png';
			if(sd>0)
			{
				arr[i].priceZ = (arr[i].price-mean)/sd;
			}
		}
	}

// Takes houses, gives houses a "distance z-score" property
function setDistZScores(arr)
	{
		var distArr = [];
		for (var i=0;i<arr.length;i++)
			{
				distArr.push(arr[i].dist);
			}

		var mean = average(distArr);
		var sd = stdDev(distArr);
		for (var i=0;i<arr.length;i++)
		{
			if(sd>0)
			{
				arr[i].distZ = (arr[i].dist-mean)/sd;
			}
		}
	}


// Takes houses, gives houses a "distance z-score" property
function setDurationZScores(arr)
	{
		var durArr = [];
		for (var i=0;i<arr.length;i++)
			{
				durArr.push(arr[i].duration);
			}

		var mean = average(durArr);
		var sd = stdDev(durArr);
		for (var i=0;i<arr.length;i++)
		{
			if(sd>0)
			{
				arr[i].durationZ = (arr[i].duration-mean)/sd;
			}
		}
	}

function homeIconPicker(arr)
	{
		for(i=0;i<arr.length;i++)
		{
			if(arr[i].priceZ+arr[i].durationZ > 2)
				{	
					arr[i].icon = iconPath + 'home-red.png';
				}

			else if(arr[i].priceZ+arr[i].durationZ > 1)
				{	
					arr[i].icon = iconPath + 'home-yellow.png';
				}
			else if(arr[i].priceZ+arr[i].durationZ < -1)
				{	
					arr[i].icon = iconPath + 'home-green.png';
				}
			else
				{	// default, already set, but just in case...
					arr[i].icon = iconPath + 'home-blue.png';
				}
		}
	}
