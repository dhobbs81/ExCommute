/**
 * Include the ExCommute namespace
 * 
 * If the ExCommuteNs is undefined, then define ExCommuteNs.
 */
var ExCommuteNs = (function (ns) {
  return ns;
}(ExCommuteNs || {}));

// Include the MapNs and give it a shorthand form
var mapNs = ExCommuteNs.MapNs;

/// Fake homes for demo!
/* for(var i=0;i<homesLimit; i++)
	{
		var house = {};
		house.name = 'wharrgarbl'+i;
		house.price = Math.floor(Math.random()*3000)+800;
		house.lat = workplace.lat + Math.random()*.4 - .2;
		house.lng = workplace.lng + Math.random()*.4 - .2;

		// variable representing the map marker
		house.marker = '';

		// file path for marker icon
		house.icon = '';

		///////////////////////////////////////////////////
		// This is a very stupid distance metric...
		house.dist = 
		// Outdated, is overwritten by travel time when computed...
			Math.pow
				(Math.pow(house.lat-workplace.lat,2)
				+ Math.pow(house.lng-workplace.lng,2)
					,.5);
		/////////////////////

		homes.push(house);
	}
	*/

function fakeHousesForSale(work)
	{
		mapNs.homesCurr = [];
		for(var i=0;i< mapNs.homesLimit-3; i++)
			{
				var house = {};
				house.name = 'wharrgarbl'+i;
				house.price = Math.floor(Math.random()*3000)+800;
				house.lat = work.lat + Math.random()*.6 - .3;
				house.lng = work.lng + Math.random()*.6 - .3;

				// variable representing the map marker
				house.marker = '';

				// file path for marker icon
				house.icon = '';

				///////////////////////////////////////////////////
				// This is a very stupid distance metric...
				house.dist = 
				// Outdated, need to use duration...
					Math.pow
						(Math.pow(house.lat-mapNs.workplace.lat,2)
						+ Math.pow(house.lng-mapNs.workplace.lng,2)
							,.5);
				/////////////////////

				mapNs.homesCurr.push(house);
					// Validate driveability before keeping permanently
				//homes.push(house);
			}

		if(mapNs.homes.length<20)
{



		mapNs.HomesCurr[mapNs.homesLimit-3] = {};
		mapNs.HomesCurr[mapNs.homesLimit-3].name = 'Valencia College';
		mapNs.HomesCurr[mapNs.homesLimit-3].price = 2200;
		mapNs.HomesCurr[mapNs.homesLimit-3].marker = '';
		mapNs.HomesCurr[mapNs.homesLimit-3].icon = '';
		mapNs.HomesCurr[mapNs.homesLimit-3].dist = .2;
		mapNs.HomesCurr[mapNs.homesLimit-3].address = '701 N Econlockhatchee Trail, Orlando, FL 32825';		

		mapNs.HomesCurr[mapNs.homesLimit-2] = {};
		mapNs.HomesCurr[mapNs.homesLimit-2].name = 'Wawa';
		mapNs.HomesCurr[mapNs.homesLimit-2].price = 2345;
		mapNs.HomesCurr[mapNs.homesLimit-2].marker = '';
		mapNs.HomesCurr[mapNs.homesLimit-2].icon = '';
		mapNs.HomesCurr[mapNs.homesLimit-2].dist = .1;
		mapNs.HomesCurr[mapNs.homesLimit-2].address = '11750 University Blvd, Orlando, FL 32817';		


/*		mapNs.HomesCurr[homesLimit-2] = {};
		mapNs.HomesCurr[mapNs.homesLimit-2].name = 'Matt\'s parents\' house';
		mapNs.HomesCurr[mapNs.homesLimit-2].price = 2345;
		mapNs.HomesCurr[mapNs.homesLimit-2].marker = '';
		mapNs.HomesCurr[mapNs.homesLimit-2].icon = '';
		mapNs.HomesCurr[mapNs.homesLimit-2].dist = .3;
		mapNs.HomesCurr[mapNs.homesLimit-2].address = '2555 Westminster Drive Cocoa, FL';		*/



		mapNs.HomesCurr[mapNs.homesLimit-1] = {};
		mapNs.HomesCurr[mapNs.homesLimit-1].name = 'Matt\'s house';
		mapNs.HomesCurr[mapNs.homesLimit-1].price = 1234;
		mapNs.HomesCurr[mapNs.homesLimit-1].marker = '';
		mapNs.HomesCurr[mapNs.homesLimit-1].icon = '';
		mapNs.HomesCurr[mapNs.homesLimit-1].dist = .2;
		mapNs.HomesCurr[mapNs.homesLimit-1].address = '2507 Windward Way Winter Park, FL';		
}
		else{console.log('Not listed again');}
	}

var haveMap = false;
var haveHomes = false;

// Global is good...
var map = '';
var workMarker ='';
var mapProp = '';

//$(document).click(function()
