$(document).ready(function() {


  for(let i=5; i<20; i++){
    $("#price-select").append("<option value="+i*100+">$"+i*100+"</option>");
  }

  $('select').material_select();
});


$("#search-button").on("click", function() {
  $("#onboard-card").slideUp(1000);
  $("#search-card").fadeIn(1000);
});

$("#submit-button").on("click", function(){
  $("#entry-page").slideUp(1000);
  $("#main-page").fadeIn(1000);
});


function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }
