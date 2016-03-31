angular.module('fbApp').controller('headerCtrl', ['$scope', '$rootScope', 'langService', function($scope, $rootScope, langService) {
    $rootScope.header = $rootScope.header || {
            show: false,
            title: {
                ru:'',
                en:''
            }
        };
    $scope.header = $rootScope.header;

    $scope.lang =  langService.getLanguage();

    $rootScope.$on('header:hide', function(e, data) {
        $scope.header = $rootScope.header;
        console.log(data);
    });

    $rootScope.$on('header:show', function(e, data) {
        $scope.lang =  langService.getLanguage();
        $scope.header = $rootScope.header;
        console.log(data);
    });

    $rootScope.$on('header:set', function(e, data) {
        $scope.lang =  langService.getLanguage();
        $scope.header = $rootScope.header;
        console.log(data);
        console.log($scope.lang);
    });


    $scope.action = function(name) {
      $rootScope.$broadcast(name);
    };

}]);