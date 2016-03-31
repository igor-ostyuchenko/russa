angular.module('fbApp').factory('Weather', ['db', '$rootScope', '$http', function(db, $rootScope, $http){
    var w = {},
        loaded = false;
    $http.get(window.apiServer +'api/get-weather-for-all-cities/').then(function(res) {
        w = res.data.data;
        loaded = true;
    });

    function weatherIcon(weather) {
        if (weather == undefined || weather.weather_id == undefined) {
            return "img/weather/clouds.png";
        }
        id = parseInt(weather.weather_id);
        var path = "sun";
        switch(id) {
            case 17: path = "fog"; break;
            case 7: path = "sun"; break;
            case 6: path = "cloudy"; break;
            case 2: path = "snow"; break;
            case 5:
            case 16: path = "clouds"; break;
            default: path = "rain"; break;
        }
        return "img/weather/" + path + ".png";
    };

    function windDir(weather) {
        var dir = 'южный';
        if (weather == undefined || weather.wind_direction == undefined) {
            return dir;
        }
        var dirs = {
            calm: "штиль",
            s: "южный",
            n: "северный",
            e: "восточный",
            w: "западный",
            se: "ю/з",
            sw: "ю/в",
            ne: "с/з",
            nw: "с/в"
        };
        return dirs[weather.wind_direction];
    };

    return {
        get: function(id) {
            return w[id];
        },
        assignList: function(list, scope) {
            // wait for weather data load
            function waitLoad() {
                if (!loaded) {
                    setTimeout(waitLoad, 100);
                } else {
                    doAssign();
                }
            }

            function doAssign() {
                for (var i = 0; i < list.length; i++) {
                    list[i].weather = w[list[i].id].weather;
                }
                $rootScope.$broadcast('weatherAssigned');
            }

            waitLoad();
        },
        weatherIcon: weatherIcon,
        windDir: windDir
    };
}]);