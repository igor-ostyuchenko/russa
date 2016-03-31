angular.module('fbApp')
.factory('editorsChoice', ['db', function(db) {

        return {
            list: function(city) {
                var data = db.getKey('cityData', city.id);
                return data.redactions;
            },
            getStructure: function(city) {
                var data = db.getKey('cityData', city.id);
                if (data == null) {
                    data = {
                        redactions: []
                    }
                }
                for (var i = 0; i < data.redactions.length; i++) {
                    r = data.redactions[i];
                    r.objects = data.objects.filter(function(o) { return o.redaction_id == r.id });
                    r.events = data.events.filter(function(o) { return o.redaction_id == r.id });
                    r.routes = data.routes.filter(function(o) { return o.redaction_id == r.id });
                    r.audios = data.audios.filter(function(o) { return o.redaction_id == r.id });
                }
                return data.redactions;
            }
        }
    }]);