angular.module('fbApp').factory('Favorites', ['db', '$rootScope', '$http', function(db, $rootScope, $http){
    return {
        get: function() {
            var lib = db.getOrCreateSection('Favorites');
            return {
                objects: lib.get('object') || [],
                events: lib.get('event') || [],
                audios: lib.get('audio') || [],
                routes: lib.get('route') || []
            };
        },
        set: function(obj, type, remove) {
            var typeArray = db.getKey('Favorites', type);
Log('favorites', arguments);
            if (remove) {
                if (typeArray != null) {
                    var index = -1;
                    for (var i = 0; i < typeArray.length; i++) {
                        if (typeArray[i].id == obj.id) {
                            index = i;
                            break;
                        }
                    }
                    typeArray.splice(index, 1);
                    db.setKey('Favorites', type, typeArray).save();
                    $http.get(window.apiServer + 'api/dislike/?type=' + type + '&id=' + obj.id);
                }
                return;
            }

            if (typeArray == null) {
                typeArray = [obj];
            } else {
                Log('To Server...');
                typeArray.push(obj);
                $http.get(window.apiServer + 'api/like/?type=' + type + '&id=' + obj.id);
            }
            db.setKey('Favorites', type, typeArray).save();
        },
        check: function(obj, type) {
            var typeArray = db.getKey('Favorites', type),
                contains = false;

            if (typeArray != null) {
                for (var i = 0; i < typeArray.length; i++) {
                    if (typeArray[i].id == obj.id) {
                        contains = true;
                        break;
                    }
                }
            }

            return contains;
        }
    };
}]);