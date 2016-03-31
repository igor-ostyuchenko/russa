angular.module('fbApp').factory('Routes', ['db', '$rootScope', function(db, $rootScope){
    return {
        list: function(city) {
            return $rootScope.selectedRedaction.data.routes;
        },
        setCurrent: function(obj) {
            //db.getOrCreateSection('objects').set('current', obj).save();
            $rootScope.selectedRoute = obj;
        },
        getCurrent: function() {
            return $rootScope.selectedRoute;
        }
    };
}]);