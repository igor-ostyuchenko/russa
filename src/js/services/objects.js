angular.module('fbApp').factory('Objects', ['db', '$rootScope', function(db, $rootScope){
    return {
        list: function(city) {
            return $rootScope.selectedRedaction.data.objects;
        },
        setCurrent: function(obj) {
            //db.getOrCreateSection('objects').set('current', obj).save();
            $rootScope.selectedObject = obj;
        },
        getCurrent: function() {
            return $rootScope.selectedObject;
        }
    };
}]);