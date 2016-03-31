angular.module('fbApp')
    .controller('loginCtrl', ['$scope', '$rootScope', 'City', 'langService', 'Auth', '$stateParams', '$sessionStorage', '$state',
        function($scope, $rootScope, City, langService, Auth, $stateParams, $sessionStorage, $state) {

            $(".burger-menu").removeClass('active');

            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();

            $scope.error = {text: {ru:"", en:""}, show: false};
            $scope.loading = false;

            $scope.hideError = function() {
                $scope.error = {text: {ru:"", en:""}, show: false};
            };
            $scope.showError = function (msgRu, msgEn) {
                $scope.error = {
                    text: {
                        ru: msgRu,
                        en: msgEn
                    },
                    show: true
                };
            };


            function testLogin() {
                return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test($scope.login);
            };


            $scope.focusPass = function($event) {
                if ($event.keyCode == 13) {
                    if (!testLogin()) {
                        $scope.showError("Email введён некорректно", "Email is not valid");
                        return;
                    }
                    $("#pass").focus();
                }
            };

            $scope.checkEnter = function($event) {
                if ($event.keyCode == 13) {
                    $event.preventDefault();
                    $scope.signIn();

                    /// Hide keyboard
                    var field = document.createElement('input');
                    field.setAttribute('type', 'text');
                    document.body.appendChild(field);
                    setTimeout(function() {
                        field.focus();
                        setTimeout(function() {
                            field.setAttribute('style', 'display:none;');
                            setTimeout(function() {
                                field.remove();
                            }, 50);
                        }, 50);
                    }, 50);
                }
            };

            /**
             * Вход
             */
            $scope.signIn = function() {
                //notActivated
                //invalidName
                if (!testLogin()) {
                    $scope.showError("Email введён некорректно", "Email is not valid");
                    return;
                }

                $scope.loading = true;
                Auth.signIn($scope.login, $scope.password).then(function(response) {
                    if (response.data.type == "ok") {
                        Log('Auth complete');
                        var fio = response.data.data.name + ' ' + response.data.data.lastname;
                        $sessionStorage.user = {
                            name: $scope.login,
                            fio: fio,
                            id: response.data.data.id
                        };
                        localStorage.setItem('user', JSON.stringify($sessionStorage.user));
                        $state.go($stateParams.state, $state);
                    } else {
                        $scope.showError(response.data.data.ru, response.data.data.en);
                    }
                    $scope.loading = false;
                });

            };


            $scope.sendSignUp = function(fio) {
                $scope.loading = true;
                Auth.signUp($scope.login, $scope.password, fio).then(function(response) {
                    if (response.data.type == "ok") {
                        alert({
                            ru: "Пожалуйста, подтвердите указанный адрес, пройдя по ссылке в письме, которое мы вам отправили",
                            en: "Please confirm your email by clicking the link in a message, that we send you"
                        }[$scope.lang]);
                    } else {
                        $scope.showError("Такой email уже зарегистрирован", "This email is already registered");
                    }
                    $(".fio-wrapper").fadeOut(300);
                    $scope.loading = false;
                });
            };


            /**
             * Проверка логина перед регистрацией
             */
            $scope.signUp = function() {
                $scope.hideError();
                if (!testLogin()) {
                    $scope.showError("Email введён некорректно", "Email is not valid");
                    return;
                }

                if (!$scope.password || $scope.password == '') {
                    $scope.emptyPass = true;
                    return;
                }

                $scope.emptyPass = false;
                $(".fio-wrapper").fadeIn(300);
            };

            /**
             * Восстановление пароля
             */
            $scope.amnesia = function() {
                $scope.hideError();
                if (!testLogin()) {
                    $scope.showError("Пожалуйста, введите ваш Email", "Please enter correct Email");
                    return;
                }

                Auth.recover($scope.login).then(function(response) {
                    if (response.data.type == "ok") {
                        alert({
                            ru: "На ваш Email отправлено письмо с новым паролем",
                            en: "New password sent to you Email"
                        }[$scope.lang]);
                    } else {
                        $scope.showError(response.data.data.ru, response.data.data.en);
                    }
                });

            };




        }]);