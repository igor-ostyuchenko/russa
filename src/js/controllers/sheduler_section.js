angular.module('fbApp')
    .controller('sheduler_sectionCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'ShedulerSection', '$stateParams', 'Favorites', 'Event', 'Map',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, ShedulerSection, $stateParams, Favorites, Event, Map) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');

            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();
            $scope.Section = $stateParams.section || $rootScope.sheduler_section;
            $scope.Sections = $stateParams.sections || $rootScope.sheduler_sections;
            ShedulerSection.associate($scope.Section, $scope.Sections);

            for (var i = 0; i < $scope.Section.data.length; i++) {
                if ($scope.Section.data[i].type == 'event') {
                    $scope.Section.data[i].data = Event.get($scope.Section.data[i].data);
                }
            }

            $scope.activeFilter = 'map';
            Log('Current Section:', $scope.Section);


            $scope.$on('mapInit', function() {
                Log('Map init started');
                $scope.showMapFilter = false;
                Map.showItems($scope.Section.data, $scope.city);
                $scope.activeFilter = 'objects';

            });


            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#sheduler_section .title").height() - $("#sheduler_section .filters").height() - 15;
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };

            $scope.maxLength = function(str) {
                if (str) {
                    return str.length > 16 ? str.slice(0,15)+'...' : str;
                }
                else return false;
            };

            $scope.setActive = function(item) {
                $scope.Section.data.forEach(function(obj) {
                    obj.active = false;
                });
                item.active = true;
                $timeout(function() {
                    $state.go(item.type, {object: item.data});
                }, 500);
            };

            $scope.checkFavorite = function(item) {
                return Favorites.check(item.data, item.type);
            };


            $scope.removeItem = function (item, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                item.removed = true;
                $timeout(function(){
                    var index = $scope.Section.data.indexOf(item);
                    if (index != -1) {
                        $scope.Section.data.splice(index, 1);
                        ShedulerSection.save($scope.Section);
                    }
                },300);
            };

        }]);