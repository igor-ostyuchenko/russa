angular.module('fbApp').factory('Route', ['db', '$rootScope', function(db, $rootScope){
    return {
        get: function() {
            return $rootScope.selectedRoute;
        },
        getLinkedContent: function(Route) {
            var cityData = db.getKey('cityData', Route.city_id),
                Audios = cityData.audios.filter(function(item) {
                    return Route.audios.indexOf(item.id) != -1;
                }),
                Events = cityData.events.filter(function(item) {
                    return Route.events.indexOf(item.id) != -1;
                }),
                Routes = cityData.routes.filter(function(item) {
                    return Route.routes.indexOf(item.id) != -1;
                }),
                Objects = cityData.objects.filter(function(item) {
                    return Route.objects.indexOf(item.id) != -1;
                });
            return {
                audios: Audios,
                events: Events,
                routes: Routes,
                objects: Objects
            };
        }
    };
}]);