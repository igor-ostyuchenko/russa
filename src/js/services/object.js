angular.module('fbApp').factory('Object', ['db', '$rootScope', '$state', 'Objects', function(db, $rootScope, $state, Objects){
    return {
        get: function() {
            return $rootScope.selectedObject;
        },
        getLinkedContent: function(Object) {
            var cityData = db.getKey('cityData', Object.city_id);
             var   Audios = cityData.audios.filter(function(item) {
                    item.loading = false;
                    return Object.audios.indexOf(item.id) != -1;
                }),
                Events = cityData.events.filter(function(item) {
                    return Object.events.indexOf(item.id) != -1;
                }),
                Routes = cityData.routes.filter(function(item) {
                    return Object.routes.indexOf(item.id) != -1;
                }),
                Objects = cityData.objects.filter(function(item) {
                    return Object.objects.indexOf(item.id) != -1;
                });
            return {
                audios: Audios,
                events: Events,
                routes: Routes,
                objects: Objects
            };
        },
        goToObject: function(obj, returnObj) {
            returnObj = returnObj || null;
            Objects.setCurrent(obj);
            $state.go('object', {object: obj, returnObject: returnObj});
        }
    };
}]);