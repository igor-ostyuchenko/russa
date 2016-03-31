angular.module('fbApp').factory('Audio', ['db', '$rootScope', function(db, $rootScope){
    return {
        get: function() {
            return $rootScope.selectedAudio;
        }
    };
}]);