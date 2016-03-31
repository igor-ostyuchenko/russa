angular.module('fbApp').controller('selectLangCtrl', ['$scope',  'langService', 'initView', "$timeout", '$state', 'db', 'Navigator', 'City', '$stateParams',
    function($scope, langService, initView, $timeout, $state, db, Navigator, City, $stateParams) {

        if ($stateParams.checkState && db.getKey('language', 'lang') != null) {
            $state.go('city_select');
        }

        $timeout( initView.render);


        var listen = false;
        $timeout(function() {
            listen = true;
        }, 100);



        $scope.$watch('lang', function() {
            if (listen) {
                // set local language
                langService.setLanguage($scope.lang);
                // save to device memory
                db.setKey('language', 'lang', $scope.lang).save();

                // wait and go to the next page
                $timeout(function(){
                    $state.go('city_select');
                }, 500);
            }
        });


    }]);