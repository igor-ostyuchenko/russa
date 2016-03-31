angular.module('fbApp').controller('homeCtrl',
    ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', 'City', 'Navigator',
        function($scope, initView, $timeout, db, $state, langService, City, Navigator) {
            $timeout( initView.render);


            $scope.clearLang = function() {
                db.getSection('language').remove('lang').save();
                $state.go('lang_select');
            };

            if (db.getKey('language', 'lang') == null) {
                $state.go('lang_select');
                return;
            } else {
                langService.setLanguage(db.getKey('language', 'lang'));
            }

            if (db.getKey('city', 'currentCity') == null) {
                $state.go('city_select');
                return;
            } else {
                City.setCurrent(db.getKey('city', 'currentCity'));
            }

            $state.go('editors_choice');


        }]);