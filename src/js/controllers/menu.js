angular.module('fbApp').controller('menuCtrl', ['$scope', '$rootScope', '$state', 'langService', '$timeout', function($scope, $rootScope, $state, langService, $timeout) {

    var menuItem = function(nameRu, nameEn, link, type) {
        this.title = {
            en: nameEn,
            ru: nameRu
        };
        this.link = link;
        this.type = type || 'item';
    };

    $scope.menu = {
        show: false,
        items: [
            new menuItem('Поиск', 'Search', 'search'),
            new menuItem('Выбор редакции', 'Redactions', 'editors_choice'),
            new menuItem('Календарь событый', 'Calendar', 'calendar'),
          //  new menuItem('Объекты', 'Objects', 'redaction_objects'),
            new menuItem('Карта', 'Map', 'map'),
            new menuItem('Погода', 'Weather', 'weather'),
            new menuItem('Планировщик', 'Sheduler', 'sheduler'),
            new menuItem('Мне нравится', 'Favorites', 'favorites'),
        ],
        sysItems: [
            new menuItem('Сменить регион', 'Choose city', 'city_select'),
            new menuItem('Offline доступ', 'Offline access', 'offline_pages'),
            new menuItem('Смена языка', 'Choose language', 'lang_select'),
            new menuItem('Оставить обращение', 'Leave appeal', 'appeals'),
            new menuItem('Вопрос-ответ', 'FAQ', 'faq'),
            new menuItem('О приложении', 'About', 'about_app')
        ],
        activeItem: null
    };

    $scope.$on('menubutton-pressed', function() {
        Log('toggle');
        $scope.menu.show = !$scope.menu.show;
        $scope.$apply();
        $scope.closingNow = true;
        setTimeout(function() {
            $scope.closingNow = false;
        }, 400);
    });

    $scope.closingNow = false;

    $scope.$on('close-menu', function() {
        if ($scope.menu.show && !$scope.closingNow) {
            Log('Closing');
            $scope.menu.show = false;
            $scope.$apply();
            $scope.closingNow = true;
            setTimeout(function() {
                $scope.closingNow = false;
            }, 400);
        }
    }, 200);

    $timeout(function() {
        $scope.menu.show = true;
        $timeout(function() {
            $scope.menu.show = false;
        });
    });

    $scope.$on('language_changed', function(){
        $scope.lang = langService.getLanguage();
    });

    $scope.lang = $rootScope.currentLanguage;

    $scope.menuClick = function(item) {
        item.active = true;

        $timeout(function() {
            item.active = false;
            $scope.menu.show = false;
            $state.go(item.link);
        }, 500);

    };

    $scope.menuWidth = $(window).width() * 0.7;

}]);