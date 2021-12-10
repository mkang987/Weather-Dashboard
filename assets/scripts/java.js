//Unique API Key.
const APIKEY = "e32d5c12dfa1e703c5f375a170a75b00";


//fucntion to run and get current weather information
function getCurrentWeather(city) {
    var cityWeather = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+APIKEY;
    fetch(cityWeather)
    .then(function(response) {
        if(!response.ok) {
            throw response.json();
                 }
        return response.json();
            })
    .then(function(data) {
        console.log(data);    
        $("#name").text(data.name);      
        $("#date").text(`(${moment().format("l")})`);      
        $("#icon").attr(
          "src",
          `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
        );    
        $("#temp").text(data.main.temp + " F");      
        $("#humidity").text(data.main.humidity + " %");
        $("#windspeed").text(data.wind.speed + " MPH");
  
        // UV Index
        var lon = data.coord.lon;
        var lat = data.coord.lat;
        uvIndexCheck(lat, lon);
  
        //5 day Forecast
        fiveDayForecast(lat,lon);
    });
}


//function to check the UV index.
function uvIndexCheck(lat, lon) {
    var uvIndex = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+APIKEY;
    fetch(uvIndex)
    .then(function(response) {
        if(!response.ok) {
            throw response.json();
                 }
        return response.json();
            })
    .then(function(data) {
        console.log(data);
        console.log(data.current.uvi);
        var uvInd = data.current.uvi;
        if(uvInd <= 2.0) {
            //UVI Good
            $("#uvi").text(uvInd);
            $("#uvi").addClass("green");
        } else if (uvInd > 2.0 && uvInd <= 5.0) {
            //UVI Med
            $("#uvi").text(uvInd);
            $("#uvi").addClass("orange");
        } else if(uvInd > 5.0 && uvInd <= 10.0){
            //UVI Severe
            $("#uvi").text(uvInd);
            $("#uvi").addClass("red");
        }
    });
}


function fiveDayForecast(lat,lon) {
    var weatherInfo = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+APIKEY;
    fetch(weatherInfo)
    .then(function(response) {
        if(!response.ok) {
            throw response.json();
                 }
        return response.json();
            })
    .then(function(data) {
        console.log(data.daily);
        var createCard =""
        for(var x = 1; x < 6; x++) {
            var icon = data.daily[x].weather[0].icon;
            var date = moment.unix(data.daily[x].dt).format("MM-DD-YYYY");
            createCard += `
            <div class="card text-white bg-dark col s12 m6">
                <div class="card-header text-center font-weight-bold">${date}</div>
                <div class="card-body">
                <p class="card-text text-center">
                    <img id="icon" src="https://openweathermap.org/img/w/${icon}.png"/>
                </p>
                <p class="card-text">
                    Temp: ${data.daily[x].temp.eve} F
                </p>
                <p class="card-text">
                    Humidity: ${data.daily[x].humidity}%
                </p>
                <p> Wind Speed: ${data.daily[x].wind_speed} MPH
                </p>
                </div>
          </div>`;
          $("#city-forecast").html(createCard);
        }
    });
}



getCurrentWeather("lawrenceville");

/*Search button for applied City
$(document).ready(function () {
    $("#search").on("click", function (event) {
      event.preventDefault();
      var city = $("#city").val();
      if (city == "") {
        return;
      } else {
        CityWeather(city);
        addToRecentSearches(city);
      }
    });

//Check previously searched city and return previous info
$("#last-searched").on("click", "li.list-group-item", function () {
    var city = $(this).text();
    CityWeather(city);
  })*/