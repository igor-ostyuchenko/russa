angular.module('fbApp').factory('Audios', ['db', '$rootScope', function(db, $rootScope){
    return {
        list: function(city) {
            return $rootScope.selectedRedaction.data.audios;
        },
        setCurrent: function(obj) {
            //db.getOrCreateSection('objects').set('current', obj).save();
            $rootScope.selectedAudio = obj;
        },
        getCurrent: function() {
            return $rootScope.selectedAudio;
        }
    };
}]);