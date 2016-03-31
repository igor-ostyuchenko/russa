angular.module('fbApp').factory('Map', ['db', '$rootScope', 'langService', 'Navigator', '$filter', function(db, $rootScope, langService, Navigator, $filter){

    var lang = langService.getLanguage();

    function getCoords(input) {
        var c = input.replace('z', '');
        return {
            x: parseFloat(c.split(',')[0]),
            y: parseFloat(c.split(',')[1]),
            z: parseFloat(c.split(',')[2] || 17)
        };
    };

    function createMap(coords) {
        return new google.maps.Map(document.getElementById("map_canvas"), {
            zoom: (coords && coords.z) ? coords.z : 17,
            center: coords? new google.maps.LatLng(coords.x, coords.y) : new google.maps.LatLng(0,0),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            }
        })
    };

    function sliceName(input) {
        var res = {name: input};
        res.name.en = res.name.en > 16? res.name.en.slice(15) + '...' : res.name.en;
        res.name.ru = res.name.ru > 16? res.name.ru.slice(15) + '...' : res.name.ru;
        return res.name;
    };

    function createMarker(map, coords, title, label, linkParams) {
        var marker =  new google.maps.Marker({
            position: new google.maps.LatLng(coords.x, coords.y),
            map: map,
            title: title,
            label: label,
            animation: google.maps.Animation.DROP
        });
        if (linkParams) {
            marker.linkParams = {
                object: linkParams.object,
                type: linkParams.type
            };
            marker.goToLink = Navigator.gotToLinked;
        }
        return marker;
    };

    window.goToLink = function(id, city_id, type) {
        Navigator.gotToLinkedById(id, city_id, type);
    };

    return {
        showObject: function(params) {
            params.marker = params.marker || {
                    title: undefined
                } ;
            var coords = getCoords(params.coords);
            var GoogleMap = function() {
                var map = createMap(coords);
                createMarker(map, coords, params.marker.title);

                return map;
            };
            var res = {
                name: sliceName(params.title || {en: 'Map', ru: 'Карта'}),
                coords: coords,
                mapObject:  GoogleMap()
            };
            return res;
        },
        showRoute: function(route) {
            var objects = db.getKey('cityData', route.city_id).objects
                .filter(function(obj) {
                    return route.objects.indexOf(obj.id) != -1;
                });
            objects.forEach(function(obj) {
                obj.coords = getCoords(obj.maps_xy);
            });
            var waypoints = [];
            for (var i = 1; i < objects.length -1; i++) {
                waypoints.push({
                    stopover: false,
                    location: new google.maps.LatLng(objects[i].coords.x, objects[i].coords.y)
                });
            }
            var directionsDisplay;
            var directionsService = new google.maps.DirectionsService();

            var GoogleMap = function() {
                directionsDisplay = new google.maps.DirectionsRenderer({
                    suppressMarkers: true
                });
                var map = createMap();
                directionsDisplay.setMap(map);
                function calcRoute() {
                    var request = {
                        origin: new google.maps.LatLng(objects[0].coords.x, objects[0].coords.y),
                        destination: new google.maps.LatLng(objects[objects.length-1].coords.x, objects[objects.length-1].coords.y),
                        travelMode: google.maps.TravelMode.WALKING ,
                        optimizeWaypoints: true,
                        waypoints: waypoints
                    };
                    directionsService.route(request, function(result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(result);
                        }
                    });
                }
                if (objects.length > 0) {
                    calcRoute();
                    var markers = [];
                    for (var i = 0; i < objects.length; i++) {
                        markers.push({
                            marker: createMarker(map, objects[i].coords, objects[i].name[lang], objects[i].name[lang],
                                {
                                    object: objects[i],
                                    type: 'object'
                                }),
                            infoWindow: new google.maps.InfoWindow({
                                content: "<p>" + objects[i].name[lang] + "</p><a style='display: block; width:100%; border-top: 1px solid #ddd; padding-top: 5px; font-weight: 400;' onclick='goToLink(" + objects[i].id + ", "+ objects[i].city_id +", \"object\")'>"+ $filter('translate')('Перейти') +"</a>"
                            })
                        });
                    }
                    markers.forEach(function (mark) {
                        mark.marker.addListener('click', function () {
                            mark.infoWindow.open(map, mark.marker);
                        });
                    });
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0; i < markers.length; i++) {
                        bounds.extend(markers[i].marker.getPosition());
                    }
                    map.fitBounds(bounds);
                }
                return map;
            };

            var res = {
                name: sliceName(route.name|| {en: 'Map', ru: 'Карта'}),
                mapObject:  GoogleMap()
            };
            return res;
        },
        showEvent: function(event) {
            var params = {},
                coords = getCoords(event.maps_xy);
            var GoogleMap = function() {
                var map = createMap(coords);
                var marker = createMarker(map, coords,  event.name[lang]);
                var infoWindow = new google.maps.InfoWindow({
                    content: "<p><b>" + event.name[lang] + "</b><hr/> " + event.dateStr + "</p><a style='display: block; width:100%; border-top: 1px solid #ddd; padding-top: 5px; font-weight: 400;' onclick='goToLink(" + event.id + ", "+ event.city_id +", \"event\")'>"+ $filter('translate')('Перейти') +"</a>"
                });
                infoWindow.open(map, marker);
                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                });
                return map;
            };
            var res = {
                name: sliceName(params.title || {en: 'Map', ru: 'Карта'}),
                coords: coords,
                mapObject:  GoogleMap()
            };
            return res;
        },

        showAll: function(city, callback) {
            var entityes = db.getKey('cityData', city.id),
                markers = [];
            var GoogleMap = function() {
                var map = createMap();

                var bounds = new google.maps.LatLngBounds();
                entityes.objects.forEach(function(obj) {
                    if (obj.maps_xy && obj.maps_xy != "") {
                        var marker = createMarker(map, getCoords(obj.maps_xy), obj.name[lang], obj.name[lang]);
                        marker.linkedEntity = obj;
                        marker.linkedType = 'objects';
                        bounds.extend(marker.getPosition());
                        var infoWindow = new google.maps.InfoWindow({
                            content: "<p><b>" + obj.name[lang] + "</b>" + "</p><a style='display: block; width:100%; border-top: 1px solid #ddd; padding-top: 5px; font-weight: 400;' onclick='goToLink(" + obj.id + ", "+ obj.city_id +", \"object\")'>"+ $filter('translate')('Перейти') +"</a>"
                        });
                        marker.addListener('click', function() {
                            infoWindow.open(map, marker);
                        });
                        markers.push(marker);
                    }
                });

                entityes.events.forEach(function(obj) {
                    if (obj.maps_xy && obj.maps_xy != "") {
                        var marker = createMarker(map, getCoords(obj.maps_xy), obj.name[lang], obj.name[lang]);
                        bounds.extend(marker.getPosition());
                        marker.linkedEntity = obj;
                        marker.linkedType = 'events';
                        var infoWindow = new google.maps.InfoWindow({
                            content: "<p><b>" + obj.name[lang] + "</b></p><a style='display: block; width:100%; border-top: 1px solid #ddd; padding-top: 5px; font-weight: 400;' onclick='goToLink(" + obj.id + ", "+ obj.city_id +", \"event\")'>"+ $filter('translate')('Перейти') +"</a>"
                        });
                        marker.addListener('click', function() {
                            infoWindow.open(map, marker);
                        });
                        markers.push(marker);
                    }
                });

                map.fitBounds(bounds);

                map.markers = markers;
                setTimeout(callback, 100);
                return map;
            };



            var res = {
                name: sliceName(city.name),
                mapObject:  GoogleMap()
            };
            return res;
        },

        showItems: function(data, city) {
            var entityes = data,
                markers = [];
            var GoogleMap = function() {
                var map = createMap();

                var bounds = new google.maps.LatLngBounds();
                entityes.forEach(function(item) {
                    var obj = item.data;
                    if (obj.maps_xy && obj.maps_xy != "") {
                        var marker = createMarker(map, getCoords(obj.maps_xy), obj.name[lang], obj.name[lang]);
                        bounds.extend(marker.getPosition());
                        var infoWindow = new google.maps.InfoWindow({
                            content: "<p>" + ( item.type == 'event'? ("<b>" + obj.name[lang] + "</b><hr/> " + obj.dateStr) : ("<b>" + obj.name[lang] + "</b>")) + + "</p><a style='display: block; width:100%; border-top: 1px solid #ddd; padding-top: 5px; font-weight: 400;' onclick='goToLink(" + obj.id + ", "+ obj.city_id +", \"" + item.type +"\")'>"+ $filter('translate')('Перейти') +"</a>"

                        });
                        infoWindow.open(map, marker);
                        marker.addListener('click', function() {
                            infoWindow.open(map, marker);
                        });
                        markers.push(marker);
                    }
                });


                map.fitBounds(bounds);

                map.markers = markers;

                return map;
            };



            var res = {
                mapObject:  GoogleMap()
            };
            return res;
        }
    };
}]);