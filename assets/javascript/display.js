$(document).ready(function() {


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
    ExCommuteNs.showMap(params);
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
      //types: ['geocode', 'regions']
      ///types: ['geocode']
      //types: ['address'],
      types: ['address'],
      componentRestrictions: {
        country: 'us'
      }
    });

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  // for (var component in componentForm) {
  //   document.getElementById(component).value = '';
  //   document.getElementById(component).disabled = false;
  // }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];

    var types = place.address_components[i].types;

    console.log("Autocomplete dumping types: ");
    types.forEach(function (item) {
      console.log(item);
    });

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
