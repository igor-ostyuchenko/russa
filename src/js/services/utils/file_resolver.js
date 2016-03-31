angular.module('fbApp.files', []).factory('RemoteResolver', ['$rootScope', '$timeout', function($rootScope, $timeout) {

    /**
     * Downloads file from URL, puts it to SD-card and fire's callback with new local-url
     * @param args {url: String, callback: function, error_callback: function}
     */
    function downloadFile(args) {
        var url = args.url || '',
            callback = args.callback || null,
            error_callback = args.error_callback || null;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                var imagePath = cordova.file.dataDirectory + url.split('/').pop();
                var fileTransfer = new FileTransfer();
                fileTransfer.download(url, imagePath, function (entry) {
                    var path_to_file = cordova.file.dataDirectory + entry.fullPath;
                    Log("File downloaded", path_to_file); // Вот это вставляем в src тэга img
                    callback(path_to_file);
                }, function (error) {
                    Log("Some error", error);
                    error_callback(error);
                });
            })
    }

    /**
     * Check if file exists in FileSystem
     * @param args
     */
    function checkFileExists(args) {
        var url = args.url,
            callback = args.callback || null,
            error_callback = args.error_callback || null;

        //var reader = new FileReader();
        //var fileSource = url;
        //Log("Checking file " + url);
        //reader.onloadend = function(evt) {
        //    Log(evt);
        //    callback(!(evt.target.result == null));
        //};
        //
        window.resolveLocalFileSystemURL(
            url,
            function(){
                callback(true);
            },
            function(){
                callback(false);
            }
        );
    }


    /**
     * Wait for DeviceReady and start function with user-arguments
     * @param fn
     * @param arguments
     * @returns {Function}
     */
    function runOnReady (fn) {
        return function(args) {
            if (window.__DeviceIsReady) {
                return fn(args);
            } else {
                $rootScope.$on('DeviceIsReady', function () {
                    fn(args);
                });
            }
        }
    }

    return {
        downloadFile: runOnReady(downloadFile),
        checkFile: runOnReady(checkFileExists)
    }
}]);