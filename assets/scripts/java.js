//Unique API Key.
const APIKEY = "e32d5c12dfa1e703c5f375a170a75b00";

var searchCity = document.querySelector("#citySearch");

//function to run and get current weather information
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

//fetch 5 days weather information and creates card for each day
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
        var createCard =""
        for(var x = 1; x < 6; x++) {
            var icon = data.daily[x].weather[0].icon;
            var date = moment.unix(data.daily[x].dt).format("MM-DD-YYYY");
            createCard += `
            <div class="card text-white bg-primary col s12 m6">
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

//Checks if search field has content
function checkCity(event) {
    event.preventDefault();

    var city = document.querySelector("#city").value;
    if(city == "") {
        return;
    } else {
        getCurrentWeather(city);
        recentSearch(city);
    }

}


var cities = [];
//adds search to recent search history
function recentSearch(city) {
    var addCity = document.createElement("button");
    addCity.setAttribute("class","list-group-item historyBtn");
    addCity.setAttribute("value", city);
    addCity.textContent = city;
    addCity.onclick = (e)=>{
        console.log(e.target.getAttribute('value'));
        getCurrentWeather(e.target.getAttribute('value'));
    }
    document.getElementById("searchHistory").append(addCity);

    cities.push(city);
    localStorage.setItem("searches",JSON.stringify(cities));
}


//loads stored history
function loadHistory() {
    var searches = JSON.parse(localStorage.getItem("searches"));
    console.log(searches);
    if(searches != null){
    for(var x = 0; x < searches.length; x++) {
        var addCity = document.createElement("button");
        addCity.setAttribute("class","list-group-item historyBtn");
        addCity.setAttribute("value", searches[x]);
        addCity.textContent = searches[x];
        addCity.onclick = (e)=>{
            console.log(e.target.getAttribute('value'));
            getCurrentWeather(e.target.getAttribute('value'));
        }
        document.getElementById("searchHistory").append(addCity);
    } }
}

//Default Weather display and load local storage history search
getCurrentWeather("Atlanta");
loadHistory();

//Button event reader
searchCity.addEventListener('submit',checkCity);