angular.module('fbApp')
    .controller('faqCtrl',
    ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City ) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');



            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();

            $scope.About = db.getKey('about', 'faq');


            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#faq .title").height();
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };

            $scope.windowWidth = window.innerWidth;


            $scope.unfold = function(item, index) {
                item.unfolded = !item.unfolded;
                $(".item_" + index + ' .content').slideToggle(300);
            }

        }]);