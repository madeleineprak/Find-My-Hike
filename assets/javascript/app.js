$(document).ready(function(){
/* Global Variables */
var lat, long, searchInput;
 /* Lat and Long AJAX Request from MapQuest API */
 function getLatLong(searchInput, state){
    return $.ajax({
        // url: `https://www.mapquestapi.com/geocoding/v1/address?key=ttL7KMim9EoyXL2nRjDSwVtMA5XImeGB&inFormat=kvp&outFormat=json&location=${searchInput}, ${state}&thumbMaps=false`,
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${searchInput},+${state}&key=AIzaSyDOY9Oyx6yzfqzGEky4rj7bUi31kovFk5k`,
        success: function(response) {   
        // lat = response.results[0].locations[0].latLng.lat;
        // long = response.results[0].locations[0].latLng.lng;        
        var results = response.results[0].geometry.location;
        lat = results.lat;
        long = results.lng;
        },
        error: error => console.log(error)  
    })
} 
/* Hiking Project API */
function getHikingProject(lat, long){
    return $.ajax({
        url: `https://cors-anywhere.herokuapp.com/https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&key=200585860-f4494d9d7cf44d6a85f6bfd15f2a7061`,
        success: response => {            
            for(i=0; i<response.trails.length;i++) {
                this.hikesArray = response.trails;
                var hike = response.trails[i];
                var hikeButton = $("<button>");
                hikeButton.attr("data-name", hike.name).attr("data-id", hike.id).attr("data-lat", hike.latitude).attr("data-long", hike.longitude).attr("type", "button");              
                hikeButton.addClass("hiking-button").addClass("btn btn-light btn-outline-dark");
                hikeButton.text(hike.name);           
                $("#results-here").append(hikeButton);
            }
        },
        error: error => console.log(error)
    })
};
function getHikeDetails(ID){
    return $.ajax({
        url: `https://cors-anywhere.herokuapp.com/https://www.hikingproject.com/data/get-trails-by-id?ids=${ID}&key=200585860-f4494d9d7cf44d6a85f6bfd15f2a7061`,
        success: response => {
            var trails = response.trails[0];            
            $(".title-input").text(trails.name);
            $("#rating-input").text(`${trails.stars}/5`);
            if(trails.difficulty === "green"){
                $("#difficulty-input").text("easy");
            } else if(trails.difficulty === "blue"){
                $("#difficulty-input").text("intermediate");
            } else if(trails.difficulty === "black"){
                $("#difficulty-input").text("difficult");
            } else if(trails.difficulty === "greenBlue"){
                $("#difficulty-input").text("intermediate/difficult");
            } else {
                $("#difficulty-input").text("unknown");
            };
            $("#description-input").text(trails.summary).append(`<a href=${trails.url}> Click for more info.</a>`);
            $("#image-input").attr("src", trails.imgMedium);   //need to add default if no image  
            $("#distance-input").text(trails.length + " mi")
    },
        error: error => console.log(error)
    })
};

/*Map API and AJAX Request */
//Bug present that doesnt let user type in starting point and map. I think ajax call needed for that?
function getDirections(lat, long) {   
    //need to make this so that if no map exists, do the below, else skip.
      L.mapquest.key = 'OlA3XD01BeVa2IeDq2kLC4Y4Cr3IDWMw';
      var map = L.mapquest.map('map', {
      center: [lat, long],
      layers: L.mapquest.tileLayer('map'),      
      zoom: 13,
      zoomControl: false
    }); 
    L.control.zoom({
      position: 'topright'
    }).addTo(map);
    L.mapquest.directionsControl({        
        directions: {
          options: {
            timeOverage: 25,
            doReverseGeocode: false,
          }
        },
        directionsLayer: {
          startMarker: {
            draggable: true,
            icon: 'marker-start',
            iconOptions: {},
          },
          endMarker: {
            draggable: true,
            icon: 'marker-end',
            iconOptions: {},
          },
          routeRibbon: {
            showTraffic: true
          },
          alternateRouteRibbon: {
            showTraffic: true
          },
          paddingTopLeft: [450, 20],
          paddingBottomRight: [20, 20],
        },
        startInput: {
          compactResults: true,
          disabled: false,
          location: {},
          placeholderText: 'Starting point or click on the map...',
          geolocation: {
            enabled: true
          }
        },
        endInput: {
          compactResults: true,
          disabled: false,
          location: {
             latLng: {
                 lat: lat,
                 lng: long
             } 
            },
          placeholderText: 'Destination',
          geolocation: {
            enabled: false
          }
        },
        addDestinationButton: {
          enabled: true,
          maxLocations: 10,
        },
        routeTypeButtons: {
          enabled: true,
        },
        reverseButton: {
          enabled: true,
        },
        optionsButton: {
          enabled: true,
        },
        routeSummary: {
          enabled: false,
        },
        narrativeControl: {
          enabled: true,
          compactResults: false,
          interactive: true,
        },
      }).addTo(map);
}

/* OpenWeather API FORECAST AJAX Request*/
function getWeatherForecast(lat, long){
    return $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=2d017a4453be6f15af1c818bb7e28d02`,
        success: response => {    
            console.log("forecast working");      
            var forecast = response.list[0].weather[0].description;        
            $("#weather-input").append(`<span>Today's forecast: ${forecast}</span><div>`);        
        },
        error: error => console.log(error)
    })
}
/* YELP API */
function getYelp(lat, long) {
    return $.ajax({
        url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${lat}&longitude=${long}&radius=15000&limit=10`,
        headers: {
            "Authorization": "Bearer U4zPieXnsduH4Rg3NZDZvSSMzQmAwTZqI8wc1JEwROAUknwL15_b6FiWNlkhZCMhNTBJNTm2ZzctwONE9rEob9e6DuAoCv2zUH2fO29eDglEb6F1UGIC_ILc--l7XXYx"
        },
        success: response => {            
            var business = response.businesses;
            //if none, return "no restaurants within 10 miles"
            for(var i = 0; i < response.businesses.length; i++){
                $("#yelp-input").append(`<li><a href=${business[i].url}>${business[i].name}</a><span> , ${business[i].location.city} </span></li>`)
            }
        },
        error: error => console.log(error)
    })
}
/* Empty Results */
function emptyResults(){    
    $("#weather-input").empty();
    $("#title-input").empty();
    $("#rating-input").empty();
    $("#difficulty-input").empty();
    $("#description-input").empty();
    $("#image-input").empty();
    $("#yelp-input").empty();
    $("#directions-input").empty();
    $("#distance-input").empty();
}
/* Event Listeners*/
//on submit....

// $("#search-form").parsley();
$(function() {
  $("#search-form").parsley().on("field:validated", function(){
  var ok = $(".parsley-error").length === 0;
  $(".bs-callout-info").toggleClass("hidden", !ok);
  $('.bs-callout-warning').toggleClass('hidden', ok);
  }).on("form:submit", function(){
  var ok = $(".parsley-error").length === 0;
  $(".bs-callout-info").toggleClass("hidden", !ok);
  $('.bs-callout-warning').toggleClass('hidden', ok);
  });
});

$("#submit-button").on("click", function(event){

    event.preventDefault();
    var instance = $("#term").parsley();
console.log(instance.isValid());
//  $("#search-form").validate();
//  $("#search-form").isValid();
instance.isValid();
    $("#results-here").empty();
    emptyResults();    
    searchInput = $("#term").val();  
    var state = $("#states option:selected").text();    
    $.when(getLatLong(searchInput, state)).then(function(){        
        getHikingProject(lat, long); 
        $("form").trigger("reset");        
    });   
});
$(document).on("click", ".hiking-button", function(event) {  
    event.preventDefault();
    $("#hike-display").css("visibility", "visible");
    emptyResults();      
    // map.remove();
    var hikeID = $(this).attr("data-id");  
    var hikeLat = $(this).attr("data-lat");
    var hikeLong = $(this).attr("data-long"); 
    getYelp(hikeLat, hikeLong);
    // getWeatherForecast(hikeLat, hikeLong);
    getWeather(hikeLat, hikeLong);
    getHikeDetails(hikeID);  
    getDirections(hikeLat, hikeLong);       
});
$(".openbtn").on("click", function(){
  $("#mySidebar").css("width", "250px");
  $("#main").css("margin-left", "250px");
})
$(".closebtn").on("click", function(){
  $("#mySidebar").css("width", "0");
  $("#main").css("margin-left", "0");
})
});




