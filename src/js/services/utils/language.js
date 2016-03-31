angular.module('fbApp').factory('langService', ['$rootScope', function($rootScope) {
    $rootScope.currentLanguage = 'en';
    var languages = ['en', 'ru'];
    return {
        setLanguage: function(lang) {
            if (languages.indexOf(lang) == -1) {
                throw new Error("'" + lang + "' is not valid language. Valid langs: " + languages.join(', '));
            } else {
                $rootScope.currentLanguage = lang;
                $rootScope.$broadcast('language_changed', $rootScope.currentLanguage);
            }
        },
        getLanguage: function() {
            return $rootScope.currentLanguage;
        },
        isSet: function() {
            return languages.indexOf($rootScope.currentLanguage) != -1;
        }
    }

}])
    .filter('translate', ['$rootScope', 'langService', 'translations', function($rootScope, langService, translations) {
        return function(text, lang) {
            lang = lang || langService.getLanguage() || 'en';
            return  translations[text] != undefined  ? (translations[text][lang] != undefined ? translations[text][lang]: text) : text;
        }
    }])
.filter('monthString', ['langService', 'monthStrings', function(langService, monthStrings) {
        return function(number, genetive, lang) {
            lang = lang || langService.getLanguage() || 'en';
            var key = genetive? 'genetive' : 'nominative';
            if (number < 0 || number > 11) {
                return 'WrongMonthNumber';
            }
            return monthStrings[key][number][lang] || null;
        }
    }])

.filter('weekDay', ['langService', 'weekDays', function(langService, weekDays) {
    return function(input, lang) {
        lang = lang || langService.getLanguage() || 'en';
        if (input < 0 || input > 6 || isNaN(parseInt(input))) {
            return "WrongDayNumber";
        }
        return weekDays[input][lang];
    }
}]);