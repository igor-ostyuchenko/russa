angular.module('fbApp').factory('PlanningService', ['db', '$rootScope', function(db, $rootScope) {

    function Part(name) {
        this.name = name;
        this.data = [];
    };

    Part.prototype.add = function(item) {
        if (!item.length) {
            this.data.push(item);
        } else {
            this.data = this.data.concat(item);
        }
        return this;
    };

    Part.prototype.remove = function(item) {
        var index = this.data.indexOf(item);
        if (index != -1) {
            this.data.splice(index,1);
        }
        return this;
    };


    function Item(type, data) {
        this.type = type;
        this.data = data || null;
    };


    return {
        list: function() {
            var lib = db.getOrCreateSection('Sheduler');
            return lib.get('parts') || [];
        },
        set: function() {
            var parts = db.getKey('Sheduler', 'parts');

        },

        saveParts: function(parts) {
            db.setKey('Sheduler', 'parts', parts).save();
        },

        test: function() {
            var dataBase = db.getKey('cityData', 1);
            var testItem = new Item('object', dataBase.objects[1]),
                testItem2 = new Item('object', dataBase.objects[2]),
                testItem3 = new Item('event', dataBase.events[0]);
            var lib = db.getOrCreateSection('Sheduler');
            var testPart = new Part('Test 2');
            testPart.add(testItem).add(testItem2).add(testItem3);
            console.log(testPart);
            var dbParts = lib.get('parts');
            dbParts.push(testPart);
            lib.set('parts', dbParts);
            lib.save();
        }
    }
}]);