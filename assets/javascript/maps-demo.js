



var workplace = {};
//	workplace.name = 'UCF Coding Bootcamp';
//	workplace.lat = 28.589477;
//	workplace.lng = -81.199993;
//	workplace.address = '3280 Progress Drive, Orlando, FL';


var homes = [];

//////////////////////////
// Free limit per API request
var homesLimit = 25;
//////////////////////////

//////////////////
/////// map.js:
// var iconPath = "assets/media/";
/////////////////

var iconPath = 'assets/media/';
var workIcon = iconPath + 'work.png';

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
		homes = [];
		for(var i=0;i<homesLimit; i++)
			{
				var house = {};
				house.name = 'wharrgarbl'+i;
				house.price = Math.floor(Math.random()*3000)+800;
				house.lat = work.lat + Math.random()*.4 - .2;
				house.lng = work.lng + Math.random()*.4 - .2;

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

				homes.push(house);
			}		
	}



var haveMap = false;
var haveHomes = false;

// Global is good...
var map = '';
var workMarker ='';
var mapProp = '';



//$(document).click(function()
