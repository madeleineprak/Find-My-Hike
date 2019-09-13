$(document).ready(function(){
/* Global Variables */
var lat, long, searchInput;
 /* Lat and Long AJAX Request from MapQuest API */
 function getLatLong(searchInput){
    return $.ajax({
        url: `https://www.mapquestapi.com/geocoding/v1/address?key=ttL7KMim9EoyXL2nRjDSwVtMA5XImeGB&inFormat=kvp&outFormat=json&location=${searchInput}&thumbMaps=false`,
        success: function(response) {   
        lat = response.results[0].locations[0].latLng.lat;
        long = response.results[0].locations[0].latLng.lng;             
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
                hikeButton.attr("data-name", hike.name);
                hikeButton.attr("data-id", hike.id);              
                hikeButton.addClass("hiking-button");
                hikeButton.text(hike.name);
                // var hikeImage = $("<img>");
                // var hikeImageUrl = hike.imgSqSmall;
                // hikeImage.attr("src", hikeImageUrl);
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
            console.log(trails);
            $("#title-input").text(trails.name);
            $("#rating-input").text(`${trails.stars}/5`);
            if(trails.difficulty === "green"){
                $("#difficulty-input").text("easy");
            } else if(trails.difficulty === "blue"){
                $("#difficulty-input").text("intermediate");
            } else if(trails.difficulty === "black"){
                $("#difficulty-input").text(difficult);
            } else {
                $("#difficulty-input").text("unknown");
            };
            $("#description-input").text(trails.summary);

            

        //         $("#image-input").attr("src", this.pickedHike.photo);
                // var hikeImage = $("<img>");
                // var hikeImageUrl = hike.imgSqSmall;
                // hikeImage.attr("src", hikeImageUrl);  
    },
        error: error => console.log(error)
    })
};

// var hikingProject = {   
//     hikesArray: [],
//     pickedHike: {
//         name: "",
//         photo: "",
//         rating: "",
//         description: "",
//         difficulty: "",
//     },
//     clickHikeButton: function(hike) {
//              // for (i=0; i<this.hikesArray.length; i++) {
        //     if (hike === this.hikesArray[i].name) {
        //         this.pickedHike.name = this.hikesArray[i].name;
        //         this.pickedHike.photo = this.hikesArray[i].imgSqSmall;
        //         this.pickedHike.rating = this.hikesArray[i].stars;
        //         this.pickedHike.description = this.hikesArray[i].summary;
        //         this.pickedHike.difficulty = this.hikesArray[i].difficulty;
        //         console.log("success");
        //         $("#title-input").text(this.pickedHike.name);
        //         $("#rating-input").text(this.pickedHike.rating);
        //         $("#difficulty-input").text(this.pickedHike.difficulty);
        //         $("#description-input").text(this.pickedHike.description);
        //         $("#image-input").attr("src", this.pickedHike.photo);
        //     }
        // }
//     },   
// }

/* Hiking Project API and AJAX Request */
function getDirections(lat, long) {
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
function getWeather(lat, long){
    return $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=2d017a4453be6f15af1c818bb7e28d02`,
        success: function(response){           
            var weather = response.weather[0].description;
            var icon = response.weather[0].icon;
            var temp = response.main.temp;
            var tempF = Math.round(convert(temp));            
            var sunrise = response.sys.sunrise;
            var sunset = response.sys.sunset;
            function convert(K){
                var F = (K - 273.15) * 1.80 + 32;
                return F;
            }
            function convertTime(T){
                var dt = new Date(T * 1000);
                var hr = dt.getHours();
                var m = "0" + dt.getMinutes();           
                return `${hr}:${m.substr(-2)}`;   
            }      
            var sunsetConvert = convertTime(sunset);    
            var sunriseConvert = convertTime(sunrise);        
            $("#weather-input").append(`<img src="assets/images/${icon}.png" alt="weather icon" width="60" height="60"><span>${weather}</span><div>Sunrise: ${sunriseConvert}</div><div>Sunset:${sunsetConvert}</div><div>Temp: ${tempF}&#8457</div>`);        
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
}
/* Event Listeners*/
//on submit....
$("#submit-button").on("click", function(){
    event.preventDefault();
    $("#results-here").empty();
    emptyResults();
    searchInput = $("#term").val();           
    $.when(getLatLong(searchInput)).then(function(){
        console.log(lat);
        console.log(long);    
        getHikingProject(lat, long);        
    });   
});

$(document).on("click", ".hiking-button", function(event) {  
    emptyResults();  
    var hikeID = $(this).attr("data-id");  
    console.log(hikeID);    
    getHikeDetails(hikeID);
    // var pickedHike = $(this).text();   
    // hikingProject.clickHikeButton(pickedHike);
    getWeather(lat, long);
    getDirections(lat, long);
});

});

