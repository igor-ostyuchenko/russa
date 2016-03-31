angular.module('fbApp', [
    'ngAnimate',
    'ngSanitize',
    'ngStorage',
    'ngTouch',
    'fbApp.routes',
    'fbApp.db',
    'fbApp.files'
])
    .config(function($logProvider){
        $logProvider.debugEnabled(true);
    })
    .run([
        '$rootScope', '$state', '$stateParams', 'SessionService', 'LocalResolver', '$sessionStorage', '$timeout', '$interval',
        function ($rootScope, $state, $stateParams, SessionService, LocalResolver, $sessionStorage, $timeout, $interval) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $sessionStorage.user = JSON.parse(localStorage.getItem('user'));

            $rootScope.user = $sessionStorage.user;

            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    SessionService.checkAccess(event, toState, toParams, fromState, fromParams);
                }
            );

            $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                if (from.name != 'login') {
                    $rootScope.prevState = {state: from, params: fromParams};
                }
            });

            $rootScope.iOS = false;
            $rootScope.$on('iOS-detected', function() {
               $rootScope.iOS = true;
            });

            $rootScope.isIOS = function() {
              return $rootScope.iOS;
            };

            $rootScope.getImageByUrl = function(url, apply_container){
                LocalResolver.getImage(url, function(path) {

                    },
                    function(error) {
                        Log("Image loading error", error);
                    }, apply_container);
            };

            $rootScope.getAudioByUrl = function(url, callback, error_callback, audio) {
                LocalResolver.getAudio(url, callback, error_callback, false, audio);
            };

            $rootScope.ImageCache = LocalResolver.ImageCache;
            $rootScope.AudioCache = LocalResolver.AudioCache;
            $rootScope.LoadingList = {};
            $rootScope.windowWidth = window.innerWidth;

            $rootScope.loadAudio = function(audio, lang) {
                audio.loading = true;
                Log("Audio load func");
                var success = function(path) {
                        Log("Audio loaded", path);
                        audio.loading = false;
                        //$rootScope.$apply();
                        if (window.__DeviceIsReady) {
                            showAudioWindow(path, lang, audio);
                        } else {
                            $rootScope.$on('DeviceIsReady', function () {
                                showAudioWindow(path, lang, audio);
                            });
                        }
                    },
                    error = function(error){
                        audio.loading = false;
                        Log("Error ", error);
                        alert({
                            ru: "Не удалось загрузить файл. Сервер недоступен",
                            en: "Download fails. Server is unavailable"
                        }[lang]);
                        //$rootScope.$apply();
                    };

                $rootScope.getAudioByUrl(audio.file[lang].url, success, error, audio);
            };

            function showAudioWindow(url, lang, audio) {
                $("#media-player").fadeIn(300);
                $rootScope.__currentAudio.name = audio.name[lang];
                $rootScope.__currentAudio.description = audio.description[lang];
                if( device.platform === 'iOS' ) {
                    url = url.replace('file://', '');
                }
                $rootScope.__currentAudio.url = url;
                if ($rootScope.__currentAudio.media && $rootScope.__currentAudio.media.stop) {
                    $rootScope.__currentAudio.media.stop();
                    $rootScope.__currentAudio.media.release();
                    $rootScope.__currentAudio.status = 'stop';
                }
                $rootScope.__currentAudio.media = new Media(url,
                    function(s) {
                        Log("Playback Success", s);
                    },
                    function(err) {
                        Log("Playback Error", err)
                    });
                setTimeout(function() {
                    $rootScope.$apply();
                }, 0);
                Log("AudioObj: ", {NEW: $rootScope.__currentAudio, origin: audio});
            }

            $rootScope.__currentAudio = {
                name: 'No file available',
                description: '',
                url: '',
                media: {},
                progress: 0,
                duration: 0,
                progressInterval:{},
                play: function() {
                    $rootScope.__currentAudio.duration = $rootScope.__currentAudio.media.getDuration();
                    $rootScope.__currentAudio.status = 'play';
                    //  $rootScope.__currentAudio.duration = $rootScope.__currentAudio.media.duration;

                    $rootScope.__currentAudio.media.play();
                    $rootScope.__currentAudio.media.progressInterval = setInterval(function() {
                            $rootScope.__currentAudio.media.getCurrentPosition(function(pos) {
                                var dur = $rootScope.__currentAudio.media.getDuration();
                                $rootScope.__currentAudio.progress = Math.floor((pos / dur) * 100);
                                $rootScope.$apply();
                            });

                            }, 1000);
                            //$rootScope.$apply();
                        },
                        pause: function() {
                        clearInterval($rootScope.__currentAudio.media.progressInterval);
                        $rootScope.__currentAudio.status = 'pause';
                        $rootScope.__currentAudio.media.pause();
                        //$rootScope.$apply();
                    },
                    close: function() {
                        $rootScope.__currentAudio.media.stop();
                        $rootScope.__currentAudio.media.release();
                        $rootScope.__currentAudio.status = 'stop';
                        clearInterval($rootScope.__currentAudio.media.progressInterval);
                        $("#media-player").fadeOut(300);
                    },
                    status: 'stop'
                };

            $rootScope.randomNum = Math.floor(100*Math.random());

        }
    ]);

// TODO: Remove in PRODUCTION
//localStorage.clear();

window.shareParams = {
    link: function(type, id) {
        Log('sharing ' + type + ' with id=' + id);
        return encodeURIComponent(window.apiServer + 'obj/?type=' + type +'&id=' + id);
    },
    text: {
        en: "Super App",
        ru: "Супер приложение"
    }
};

window.apiServer = 'http://visit2.fatum.spb.ru/';

window.Log = function(msg, param) {
    if (console && console.log) {
        console.log('%c LOG: %c ' + msg, 'background: red; color: white; font-weight: bold;', 'background: lightgrey; color: black', param || '');
    }
};