angular.module('fbApp.files').factory('LocalResolver', ['$rootScope', '$timeout', 'RemoteResolver', 'db', 'langService', function($rootScope, $timeout, RemoteResolver, db, langService) {

    var cacheTable = db.getOrCreateSection('cacheTable');
    if (cacheTable.get('Images') == null) {
        cacheTable.set('Images', {});
    }
    if (cacheTable.get('Audios') == null) {
        cacheTable.set('Audios', {});
    }
    if (cacheTable.get('Screenshots') == null) {
        cacheTable.set('Screenshots', {});
    }
    var ImageCache = cacheTable.get('Images', {});
    var AudioCache = cacheTable.get('Audios', {});
    var ScreenshotsCache = cacheTable.get('Screenshots', {});

    function saveCache() {
        cacheTable.save();
    }

    /**
     * Downloads file and save it to cacheTable
     * @param cacheSection where to store record
     * @param url
     * @param callback
     * @param err
     */
    function downloadFile(cacheSection, url, callback, err, apply_container) {
        RemoteResolver.downloadFile({
            url: url,
            callback: function(path) {
                cacheSection[url] = path;
                cacheTable.save();
                $rootScope.LoadingList[url] = false;
                callback(path);
                if (apply_container) {
                    $(apply_container).scope().$digest();
                }
            },
            error_callback: err
        });
    }

    /**
     * Check if file already cached, check if it exists physicaly and downloads it and puts in cache if false in both scenarios
     * @param url
     * @param callback
     * @param error_callback
     */
    function getImage(url, callback, error_callback, apply_container) {
        if (ImageCache[url]) {
            Log("In cache for " + url, ImageCache[url]);
            RemoteResolver.checkFile({
                url: ImageCache[url],
                callback: function(exists) {
                    if (exists) {
                        callback(ImageCache[url]);
                    } else {
                        $rootScope.LoadingList[url] = true;
                        downloadFile(ImageCache, url, callback, error_callback, apply_container);
                    }
                }
            });

        } else {
            downloadFile(ImageCache, url, callback, error_callback, apply_container);
        }
    }

    function getAudio(url, callback, error_callback, apply_container, audio) {
        Log("Audio resolver - " + url);
        if (AudioCache[url]) {
            Log("In Cache -" + AudioCache[url]);


                        callback(AudioCache[url]);


        } else {
            Log("Not in Cache");
            //if not online, show error
            if (navigator.connection && navigator.connection.type == 'none') {
                    alert({
                        ru:"Данная аудиозапись ещё не была загружена на устройство. Установите подключение к сети интернет и повторите попытку",
                        en:"This audio-file haven't been downloaded to this device yet. Connect to the network and try again"
                    }[langService.getLanguage()]);
                if (audio) {
                    audio.loading = false;
                }
                    return;
            }
            downloadFile(AudioCache, url, callback, error_callback, apply_container);
        }
    }

    return {
        getImage: getImage,
        ImageCache: ImageCache,
        getAudio: getAudio,
        AudioCache: AudioCache,
        ScreenshotsCache: ScreenshotsCache,
        saveCache: saveCache
    }
}]);