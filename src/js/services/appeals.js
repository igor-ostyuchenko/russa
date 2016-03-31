angular.module('fbApp').factory('Appeals', ['db', '$rootScope', '$http', '$sessionStorage', function(db, $rootScope, $http, $sessionStorage){

    var categoryList = $sessionStorage.msgList || [],
        list =  $sessionStorage.categoryList || [];

    function loadMsgList() {
            $http.get(window.apiServer + 'api/get-messages/').then(function(response) {
                list =  response.data.data.messages;
                categoryList = response.data.data.categories;
                for(var i = 0; i < list.length; i++) {
                    list[i].msg = list[i].msg.replace(/\n/g, '<br/>');
                    list[i].rating = parseInt(list[i].rating);
                }
                $sessionStorage.msgList = list;
                $sessionStorage.categoryList = categoryList;
                $rootScope.$broadcast('MsgListLoaded');
            });
        return {list: list, categories: categoryList};
    }

    function send(fio, subject, text, feed, category, callback) {
        // Если юзер сменил имя - уведомляем сервер
        if (fio != $sessionStorage.user.fio) {
            $sessionStorage.user.fio = fio;
            $http.get(window.apiServer + 'api/update-user/?fio=' + encodeURIComponent(fio));
        }

        var formData = new FormData(document.getElementById("newAppeal"));
        $.ajax({
            url: window.apiServer + 'api/add-message/',
            type: 'POST',
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (returndata) {
                callback();
            }
        });


    }

    function rate(appeal, rate) {
        return $http.get(window.apiServer + 'api/update-message/?id='+ appeal.id +'&rating=' + rate);
    }

    return {
        loadMessages: loadMsgList,
        send: send,
        rate: rate
    };
}]);