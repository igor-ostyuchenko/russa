angular.module('fbApp')
    .controller('audiosCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Audios',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Objects) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');

            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();
            $scope.selected = null;

            $scope.selection = Audios.list($scope.city);

            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#objects .title").height();
            };

            $scope.setActive = function(item) {
                $scope.selection.forEach(function(obj) {
                    obj.active = false;
                });
                item.active = true;

                $timeout(function() {
                    Audios.setCurrent(item);
                    $state.go('audio');
                }, 500);
            };

        }]);