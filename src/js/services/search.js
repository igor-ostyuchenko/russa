angular.module('fbApp').factory('Search', ['db', '$rootScope', 'City', '$state', function(db, $rootScope, City, $state){
    return {
        processQuery: function(query) {
            var city = City.getCurrent(),
                data = db.getKey('cityData', city.id);

            function filtrate(arr, str) {
                var result = [],
                    query = str.toUpperCase();
                for (var i = 0; i < arr.length; i++) {
                    var enNameSuggest = arr[i].name.en.toUpperCase().indexOf(query) != -1,
                        ruNameSuggest = arr[i].name.ru.toUpperCase().indexOf(query) != -1,
                        enDescSuggest = arr[i].description.en.toUpperCase().indexOf(query) != -1,
                        ruDescSuggest = arr[i].description.ru.toUpperCase().indexOf(query) != -1,
                        enAddrSuggest = arr[i].contacts.ru.toUpperCase().indexOf(query) != -1,
                        ruAddrSuggest = arr[i].contacts.ru.toUpperCase().indexOf(query) != -1;
                    if (enNameSuggest || ruNameSuggest || enDescSuggest || ruDescSuggest || enAddrSuggest || ruAddrSuggest) {
                        result.push(arr[i]);
                    }
                }
                return result;
            }

            return {
                objects: filtrate(data.objects, query),
                routes: filtrate(data.routes, query),
                events: filtrate(data.events, query),
            }

        },
        checkEntity: function (obj, str) {
            var query = str.toUpperCase();

            var enNameSuggest = obj.name.en.toUpperCase().indexOf(query) != -1,
                ruNameSuggest = obj.name.ru.toUpperCase().indexOf(query) != -1,
                enDescSuggest = obj.description.en.toUpperCase().indexOf(query) != -1,
                ruDescSuggest = obj.description.ru.toUpperCase().indexOf(query) != -1,
                enAddrSuggest = obj.contacts.ru.toUpperCase().indexOf(query) != -1,
                ruAddrSuggest = obj.contacts.ru.toUpperCase().indexOf(query) != -1;

            return (enNameSuggest || ruNameSuggest || enDescSuggest || ruDescSuggest || enAddrSuggest || ruAddrSuggest);
        }
    };
}]);