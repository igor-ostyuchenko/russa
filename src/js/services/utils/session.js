angular.module('fbApp')
    .service('SessionService', ['$injector', function($injector) {
            "use strict";

        var checkAuth = function(toState, toParams, event, $sessionStorage, $scope) {
            Log('Need auth');
            // вход с авторизацией
            if ($sessionStorage.user) {
                $scope.$root.user = $sessionStorage.user;
                Log('Auth granted');
            } else {
                // если пользователь не авторизован - отправляем на страницу авторизации
                Log('No auth, redirecting');

                event.preventDefault();
                $scope.$state.go('login', {state: toState, params: toParams});
            }
        };

            this.checkAccess = function(event, toState, toParams, fromState, fromParams) {
                var $scope = $injector.get('$rootScope'),
                    $sessionStorage = $injector.get('$sessionStorage');

                if (toState.data !== undefined) {
                    if (toState.data.noLogin !== undefined && toState.data.noLogin) {
                        // если нужно, выполняйте здесь какие-то действия
                        // перед входом без авторизации

                    } else {
                        checkAuth(toState, toParams, event, $sessionStorage, $scope);
                    }
                } else {
                    checkAuth(toState, toParams, event, $sessionStorage, $scope);
                }
            };
        }
    ]);