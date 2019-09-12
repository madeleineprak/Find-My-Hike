$(document).ready(function(){

/* Global Variables */
var limit = 10;
var lat = "47.550701";
var long = "-122.257241";
var maxDistance = 5;
var searchInput;

var hikingProject = {
    url: "https://www.hikingproject.com/data/get-trails?",
    lat: "lat=" + lat,
    long: "&lon=" + long,
    key: "&key=200585860-f4494d9d7cf44d6a85f6bfd15f2a7061",
    hikesArray: [],
    pickedHike: {
        name: "",
        photo: "",
        rating: "",
        description: "",
        difficulty: "",
    },
    clickHikeButton: function(hike) {
        for (i=0; i<this.hikesArray.length; i++) {
            if (hike === this.hikesArray[i].name) {
                this.pickedHike.name = this.hikesArray[i].name;
                this.pickedHike.photo = this.hikesArray[i].imgSqSmall;
                this.pickedHike.rating = this.hikesArray[i].stars;
                this.pickedHike.description = this.hikesArray[i].summary;
                this.pickedHike.difficulty = this.hikesArray[i].difficulty;

                console.log("success");

                $("#title-input").text(this.pickedHike.name);
                $("#rating-input").text(this.pickedHike.rating);
                $("#difficulty-input").text(this.pickedHike.difficulty);
                $("#description-input").text(this.pickedHike.description);
                $("#image-input").attr("src", this.pickedHike.photo);
            }
        }
    },   
    getRequest: function() {
        this.url = this.url + this.lat + this.long + this.key;
        $.get(this.url).done(response => {
            console.log(response.trails);
            for(i=0; i<response.trails.length;i++) {
                this.hikesArray = response.trails;
                var hike = response.trails[i];
                var hikeButton = $("<button>");
                hikeButton.attr("data-name", hike.name);
                hikeButton.addClass("hiking-button");
                hikeButton.text(hike.name);
                // var hikeImage = $("<img>");
                // var hikeImageUrl = hike.imgSqSmall;
                // hikeImage.attr("src", hikeImageUrl);
                $("#results-here").append(hikeButton);

            }
        }).fail(error => {
            console.log(`Error is ${error}`);
        });
    }
}
console.log(hikingProject);

/* Hiking Project API and AJAX Request */
// var keyHP = "200587910-1aacef0df16d21253c054171004e368e";
// var proxy = "https://cors-anywhere.herokuapp.com/"
// var URLHP = `${proxy}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${maxDistance}&key=${keyHP}`;
// $.get(URLHP).done(response => {
//         console.log(response);
//     }).fail(error => {
//         console.log(`error is ${error}`);   
//     });
/* Mapquest Directions AJAX Request*/

/* OpenWeather API AJAX Request*/
var openWeaterAPI = {
    APIKey: "2d017a4453be6f15af1c818bb7e28d02",
    getRequest: function(){
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${this.APIKey}`;    
        var forecastURL = `https://api.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${long}&appid=${this.APIKey}`;         
        $.get(queryURL).done(response => {
        console.log(response);
        var weather = response.weather[0].description;
        var icon = response.weather[0].icon;
        var temp = response.main.temp;
        var tempF = Math.round(convert(temp));
        var wind = response.wind.speed;
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
        console.log(icon);     
        $("#weather-input").append(`<img src="../images/${icon}.png" alt="weather icon" width="42" height="42"><span>${weather}</span><div>Sunrise: ${sunriseConvert}</div><div>Sunset:${sunsetConvert}</div><div>Temp: ${tempF}&#8457</div>`)
        });
        $.get(forecastURL).done(response => {
            console.log(response);            
        })
    }
}
openWeaterAPI.getRequest();



/* Event Listeners*/
//on submit....
$("#submit-button").on("click", function(){
    event.preventDefault();
    searchInput = $("#term").val();
    console.log(searchInput);

    /* Lat and Long AJAX Request from MapQuest API */
    var keyMQ = "ttL7KMim9EoyXL2nRjDSwVtMA5XImeGB";
    var URLMQLL = `https://www.mapquestapi.com/geocoding/v1/address?key=${keyMQ}&inFormat=kvp&outFormat=json&location=${searchInput}&thumbMaps=false`;
    $.get(URLMQLL).done(response => {   
        lat = response.results[0].locations[0].latLng.lat;
        long = response.results[0].locations[0].latLng.lng;   
        console.log(response);  
        console.log(lat);
        console.log(long);
        hikingProject.getRequest();
    }).fail(error => {
        consolelog(`error is ${error}`);
    });
    
});

$(document).on("click", ".hiking-button", function(event) {
    event.preventDefault();
    var pickedHike = $(this).text();
    console.log(pickedHike);
    hikingProject.clickHikeButton(pickedHike);
});

});

