


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
		homesCurr = [];
		for(var i=0;i<homesLimit-3; i++)
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
						(Math.pow(house.lat-workplace.lat,2)
						+ Math.pow(house.lng-workplace.lng,2)
							,.5);
				/////////////////////

				homesCurr.push(house);
					// Validate driveability before keeping permanently
				//homes.push(house);
			}

		if(homes.length<20)
{



		homesCurr[homesLimit-3] = {};
		homesCurr[homesLimit-3].name = 'Valencia College';
		homesCurr[homesLimit-3].price = 2200;
		homesCurr[homesLimit-3].marker = '';
		homesCurr[homesLimit-3].icon = '';
		homesCurr[homesLimit-3].dist = .2;
		homesCurr[homesLimit-3].address = '701 N Econlockhatchee Trail, Orlando, FL 32825';		

		homesCurr[homesLimit-2] = {};
		homesCurr[homesLimit-2].name = 'Wawa';
		homesCurr[homesLimit-2].price = 2345;
		homesCurr[homesLimit-2].marker = '';
		homesCurr[homesLimit-2].icon = '';
		homesCurr[homesLimit-2].dist = .1;
		homesCurr[homesLimit-2].address = '11750 University Blvd, Orlando, FL 32817';		


/*		homesCurr[homesLimit-2] = {};
		homesCurr[homesLimit-2].name = 'Matt\'s parents\' house';
		homesCurr[homesLimit-2].price = 2345;
		homesCurr[homesLimit-2].marker = '';
		homesCurr[homesLimit-2].icon = '';
		homesCurr[homesLimit-2].dist = .3;
		homesCurr[homesLimit-2].address = '2555 Westminster Drive Cocoa, FL';		*/



		homesCurr[homesLimit-1] = {};
		homesCurr[homesLimit-1].name = 'Matt\'s house';
		homesCurr[homesLimit-1].price = 1234;
		homesCurr[homesLimit-1].marker = '';
		homesCurr[homesLimit-1].icon = '';
		homesCurr[homesLimit-1].dist = .2;
		homesCurr[homesLimit-1].address = '2507 Windward Way Winter Park, FL';		
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
