angular.module('fbApp')
    .controller('editorsChoiceCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'editorsChoice', 'City', 'Navigator', 'RemoteResolver',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, editorsChoice, City, Navigator, RemoteResolver) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');
            //$scope.$on('backbutton-pressed', function(event, data) {
            //    $state.go('city_select');
            //});

            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();
            $scope.selected = null;


            $scope.selection = editorsChoice.getStructure($scope.city);

            $scope.windowWidth = window.innerWidth;
            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#editors_choice .title").height();
            };


            $scope.setSelect = function(item, type, index) {
                $scope.selected = item.name[$scope.lang] + '.' + type;
                $rootScope.selectedRedaction = { data: item, type: 'type'};
                $timeout(function() {
                   $state.go('redaction_' + type);
                });
            };



        }]);