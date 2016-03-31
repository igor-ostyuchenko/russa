angular.module('fbApp').factory('Header', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    return {
        show: function(time) {
            $timeout(function() {
                $rootScope.header.show = true;
                $rootScope.$broadcast('header:show');
            }, time || 0);
        },
        hide: function(time) {
            $timeout(function() {
                $rootScope.header.show = false;
                $rootScope.$broadcast('header:hide');
            }, time || 0);
        },
        set: function(content) {
            $rootScope.header = content;
            $rootScope.$broadcast('header:set', content);
        }
    }
}]);