$(document).ready(function(){

/* Global Variables */
var limit = 10;
var lat = 47.550701;
var long = -122.257241;
var maxDistance = 5;
var searchInput;

/* Hiking Project API and AJAX Request */
var keyHP = "200587910-1aacef0df16d21253c054171004e368e";
var proxy = "https://cors-anywhere.herokuapp.com/"
var URLHP = `${proxy}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${maxDistance}&key=${keyHP}`;
$.get(URLHP).done(response => {
        console.log(response);
    }).fail(error => {
        console.log(`error is ${error}`);   
    });
/* Mapquest Directions AJAX Request*/
// APIkey = OlA3XD01BeVa2IeDq2kLC4Y4Cr3IDWMw;
window.onload = function() {
    L.mapquest.key = 'OlA3XD01BeVa2IeDq2kLC4Y4Cr3IDWMw';

    var map = L.mapquest.map('map', {
      center: [47.6050, -122.3344],
      layers: L.mapquest.tileLayer('map'),
      zoom: 13,
      zoomControl: false
    });

    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    L.mapquest.directionsControl({
      routeSummary: {
        enabled: false
      },
      narrativeControl: {
        enabled: true,
        compactResults: false
      }
    }).addTo(map);
  }
/* OpenWeather API AJAX Request*/

/* Event Listeners*/
//on submit....
$("#submit-button").on("click", function(){
    event.preventDefault();
    searchInput = $("#term").val();
    console.log(searchInput);

    /* Lat and Long AJAX Request from MaoQuest API */
    var keyMQ = "ttL7KMim9EoyXL2nRjDSwVtMA5XImeGB";
    var URLMQLL = `https://www.mapquestapi.com/geocoding/v1/address?key=${keyMQ}&inFormat=kvp&outFormat=json&location=${searchInput}&thumbMaps=false`;
    $.get(URLMQLL).done(response => {   
        lat = response.results[0].locations[0].latLng.lat;
        long = response.results[0].locations[0].latLng.lng;     
        console.log(lat);
        console.log(long);
    }).fail(error => {
        consolelog(`error is ${error}`)
    });
    
});


});