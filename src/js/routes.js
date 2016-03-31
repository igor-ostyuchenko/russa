angular.module('fbApp.routes', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('auth', {
                url: '/auth',
                templateUrl: 'partials/auth.html',
                data: {
                    'noLogin': true
                }
            })

            .state('lang_select', {
                url: '/lang_select',
                templateUrl: 'partials/language_select.html',
                controller: 'selectLangCtrl',
                params: {checkState: false},
                data: {
                    'noLogin': true
                }
            })

            .state('city_select', {
                url: '/city_select',
                templateUrl: 'partials/city_select.html',
                controller: 'selectCityCtrl',
                params: {checkState: false, noData: false},
                data: {
                    'noLogin': true
                }
            })

            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'homeCtrl',
                data: {
                    'noLogin': true
                }
            })

            .state('city_guide', {
                url: '/city_guide',
                controller: 'cityGuideCtrl',
                templateUrl: 'partials/city_guide.html',
                data: {
                    'noLogin': true
                }
            })

            .state('editors_choice', {
                url: '/editors_choice',
                controller: 'editorsChoiceCtrl',
                templateUrl: 'partials/editors_choice.html',
                data: {
                    'noLogin': true,
                    'prevState': 'city_select'
                }
            })

            .state('redaction_objects', {
                url: '/objects',
                controller: 'objectsCtrl',
                templateUrl: 'partials/objects.html',
                data: {
                    'noLogin': true,
                    'prevState': 'editors_choice'
                }
            })
            .state('redaction_events', {
                url: '/events',
                controller: 'eventsCtrl',
                templateUrl: 'partials/events.html',
                data: {
                    'noLogin': true,
                    'prevState': 'editors_choice'
                }
            })
            .state('redaction_routes', {
                url: '/routes',
                controller: 'routesCtrl',
                templateUrl: 'partials/routes.html',
                data: {
                    'noLogin': true,
                    'prevState': 'editors_choice'
                }
            })
            .state('redaction_audios', {
                url: '/audios',
                controller: 'audiosCtrl',
                templateUrl: 'partials/audios.html',
                data: {
                    'noLogin': true,
                    'prevState': 'editors_choice'
                }
            })
            .state('object', {
                url: '/object',
                controller: 'objectCtrl',
                templateUrl: 'partials/object.html',
                params: {object: null, returnObject: null},
                data: {
                    'noLogin': true
                }
            })
            .state('route', {
                url: '/route',
                controller: 'routeCtrl',
                templateUrl: 'partials/route.html',
                params: {object: null, returnObject: null},
                data: {
                    'noLogin': true
                }
            })
            .state('event', {
                url: '/event',
                controller: 'eventCtrl',
                templateUrl: 'partials/event.html',
                params: {object: null, returnObject: null},
                data: {
                    'noLogin': true
                }
            })
            .state('audio', {
                url: '/audio',
                controller: 'audioCtrl',
                templateUrl: 'partials/audio.html',
                data: {
                    'noLogin': true
                }
            })


            .state('map', {
                url: '/map',
                controller: 'mapCtrl',
                templateUrl: 'partials/map.html',
                params:      {'coords': null, 'title': null, 'mark': null, object: null, type: null},
                data: {
                    'noLogin': true
                }
            })

            .state('favorites', {
                url: '/favorites',
                controller: 'favoritesCtrl',
                templateUrl: 'partials/favorites.html',
                data: {
                    'noLogin': true
                }
            })

            .state('search', {
                url: '/search',
                controller: 'searchCtrl',
                templateUrl: 'partials/search.html',
                data: {
                    'noLogin': true
                }
            })

            .state('calendar', {
                url: '/calendar',
                controller: 'calendarCtrl',
                templateUrl: 'partials/calendar.html',
                data: {
                    'noLogin': true
                }
            })

            .state('weather', {
                url: '/weather',
                controller: 'weatherCtrl',
                templateUrl: 'partials/weather.html',
                data: {
                    'noLogin': true
                }
            })
            .state('appeals', {
                url: '/appeals',
                controller: 'appealsCtrl',
                templateUrl: 'partials/appeals.html',
                data: {
                    'noLogin': false
                }
            })

            .state('login', {
                url: '/login',
                controller: 'loginCtrl',
                templateUrl: 'partials/login.html',
                params: {state: null, params: null}, // go-back state and params
                data: {
                    'noLogin': true
                }
            })

            .state('sheduler', {
                url: '/sheduler',
                controller: 'shedulerCtrl',
                templateUrl: 'partials/sheduler.html',
                params: {addItem: null, type: null},
                data: {
                    'noLogin': true
                }
            })

            .state('sheduler_section', {
                url: '/sheduler_section',
                controller: 'sheduler_sectionCtrl',
                templateUrl: 'partials/sheduler_section.html',
                params: {section: null, sections: null},
                data: {
                    'noLogin': true
                }
            })

            .state('offline_pages', {
                url: '/offline_pages',
                controller: 'offline_pagesCtrl',
                templateUrl: 'partials/offline_pages.html',
                data: {
                    'noLogin': true
                }
            })

            .state('about_app', {
                url: '/about_app',
                controller: 'about_appCtrl',
                templateUrl: 'partials/about_app.html',
                data: {
                    'noLogin': true
                }
            })

            .state('faq', {
                url: '/faq',
                controller: 'faqCtrl',
                templateUrl: 'partials/faq.html',
                data: {
                    'noLogin': true
                }
            })

        ;


    }]);