const APIKEY = "e32d5c12dfa1e703c5f375a170a75b00";
var cityZip = 30043;

function getLatLon(zip) {
    var citySearch = "http://api.openweathermap.org/geo/1.0/zip?zip="+ zip + "&appid="+ APIKEY;
    var LAT_LON = [];
    fetch(citySearch)
    .then(function(response) {
        if(!response.ok) {
            throw response.json();
                 }
        return response.json();
            })
    .then(function(data) {
        console.log(data)
        LAT_LON.push(data.lat,data.lon);
        console.log(LAT_LON);

    });
}

function getWeather(lat,lon) {
    var cityWeather = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid="+APIKEY;
    fetch(cityWeather)
    .then(function(response) {
        if(!response.ok) {
            throw response.json();
                 }
        return response.json();
            })
    .then(function(data) {
        console.log(data)

        for(var x = 0; x < 5; x++) {
            
        }
    });
}


getLatLon(cityZip);
getWeather(34.0031,-84.0126);