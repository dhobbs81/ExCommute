$(document).ready(function(){

  //build house objects from the onboard informatics api call,
  //make calls to zillow to get the price/rent zestimate
  function buildHouseObjects(housesJSON){
    var houses = [];

    console.log(housesJSON.property[0]);

    for(let i=0; i<housesJSON.property.length; i++){
      var temp = housesJSON.property[i];
      var house = {
        distance: temp.location.distance,
        latitude: temp.location.latitude,
        longitude: temp.location.longitude,
        addr1: temp.address.line1,
        addr2: temp.address.line2,
        price: -1
      };
      houses.push(house);
      //getZestimate(house);
    }
    console.log(houses);
    return houses;
  }

  //called to set up ajax request and  set callback
  function retrieveHouses(){
    var url = "https://search.onboard-apis.com/propertyapi/v1.0.0/property/address";
    var parameters = $.param({
      'address1': "10838 Heather Ridge Circle",
      'address2': "Orlando, FL 32817",
      'radius': 10,
      'orderby': "distance",
      'pagesize': 10
    });

    url+="?"+parameters;

    if(window.localStorage.getItem(url)){
      console.log("retrieving from cache");
      var cachedHouse = JSON.parse(window.localStorage.getItem(url));
      //console.log(cachedHouse);
      buildHouseObjects(cachedHouse);
    }
    else{
      console.log("Making request to",url);

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
        buildHouseObjects(response);
      });
    }
  }

  //request zestimate from zillow for each house
  function getZestimate(house){
    if(house.price != -1){
      console.log("already got the price");
    }
    else{
      var url = "http://www.zillow.com/webservice/GetSearchResults.htm"

      var parameters = $.param({
        'zws-id': "X1-ZWz1962gltdszv_4srxq",
        'address': house.addr1,
        'citystatezip': house.addr2,
        'rentzestimate': "true"
      });

      url+= "?"+parameters;

      $.ajax({
        type: "GET",
        url: url,
        dataType: "xml",
        success: function(xml) {
          console.log(xml);
          console.log("price request: ",xml.getElementsByTagName("amount").text());
        }
      });
    }

  }


  $("#startButtonInner").on("click", retrieveHouses);
});
