angular.module('fbApp').factory('City', ['db', '$rootScope', '$http', function(db, $rootScope, $http) {
    var City = function(name, title, image, info) {
        this.name = name;
        this.title = title;
        this.image = image;
        this.info = info;
    };

    var cities = [];

    function loadCityList(callback) {
        callback = callback || function(){};
        // Если мы оффлайн и нет данных о списке городов, говорим, что всё плохо
        if (navigator.connection && navigator.connection.type == 'none') {
            Log('App is offline, checking db..');
            var c = db.getKey('city', 'list');
            if (c == null) {
                Log('Db is empty, data-error');
                cities = {
                    then: function (func) {
                        func({data: {data: {cities: []}}});
                    }
                };
                callback(cities);
                // Ничего нет, паникуем
                $rootScope.$broadcast('no-data-offline-error');
            } else {
                Log('Db has data', c);
                // Мы оффлайн, но данные есть с прошлого раза - отдаём их
                cities = {
                    then: function (func) {
                        func({data: {data: {cities: c}}});
                    }
                };
                callback(cities);
            }
        } else {
            Log('App is online, downloading cities list...');
            // Мы онлайн, грузим данные
            $http.get(window.apiServer + 'api/get-data/').then(function (data) {
                db.setKey('city', 'list', data.data.data.cities);
                db.setKey('about', 'info', data.data.data.about);
                db.setKey('about', 'faq', data.data.data.faq);

                var tags = data.data.data.tags,
                    tags_WR = {};
                tags.forEach(function(tag) {
                    tags_WR[tag.id] = tag;
                });
                db.setKey('tags', 'list', tags_WR);


                // Load images to SD-card
                data.data.data.cities.forEach(function (city) {
                    if (city.img.url || city.img.url != '') {
                        $rootScope.getImageByUrl(city.img.url, '.view');
                    }
                });
                /////////////////////////
                cities = {
                    then: function (func) {
                        func(data);
                    }
                };
                callback(cities);
            });
        }
    }
    loadCityList();

    function getCityInfo(id) {
        if (navigator.connection && navigator.connection.type == 'none') {
            var data = db.getKey('cityData',id);
            Log('Offline, getting city info from storage');
            return {
                then: function(func) {
                    func({data: {data: data}});
                }

            };
        }
        return $http.get(window.apiServer + 'api/get-city-data/?id=' + id);
    };

    return {
        list: function() {
            return cities;
        },
        reload: function(callback) {
            loadCityList(callback);
        },

        get: function(id) {
            return getCityInfo(id);
        },
        setCurrent: function(city, callback) {
            $rootScope.currentCity = city;
            db.setKey('city', 'currentCity', city).save();

            if ( false && db.getKey('cityData', city.id) != null) {
                return {
                    then: function(callback) {
                        callback();
                    }
                }
            } else {
                return getCityInfo(city.id).then(function (data) {
                    var c = data.data.data;
                    Log('City info downloaded and saved to storage', c);
                    db.setKey('cityData', city.id, c);
                    Log('Callback init');
                    callback();

                });
            }

        },
        getCurrent: function() {
            return $rootScope.currentCity;
        },
        getData: function(city) {
            return db.getKey('cityData', city.id);
        },
        isSet: function() {
            return cities.indexOf($rootScope.currentCity) != -1;
        }
    }
}]);