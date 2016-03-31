angular.module('fbApp')
    .factory('Auth', ['$http', function($http) {
        "use strict";

        function signIn(name, pass) {
            return $http.get(window.apiServer +'auth/auth/?email='+ name +'&pass=' + pass);
        };

        function signUp(name, pass, fio) {
            return $http.get(window.apiServer +'register/reg/?email='+ name +'&pass='+ pass +'&repass='+ pass +'&name='+encodeURIComponent(fio.first) + '&lastname=' + encodeURIComponent(fio.last));
        };

        function recover(name) {
            return $http.get(window.apiServer +'register/remind-pass/?email=' + name);
        };

        return {
            signIn: signIn,
            signUp: signUp,
            recover: recover
        };
    }
    ]);