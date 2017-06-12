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
