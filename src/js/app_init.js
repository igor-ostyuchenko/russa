//var app = {
//    // Application Constructor
//    initialize: function() {
//        this.bindEvents();
//    },
//    // Bind Event Listeners
//    //
//    // Bind any events that are required on startup. Common events are:
//    // 'load', 'deviceready', 'offline', and 'online'.
//    bindEvents: function() {
//        document.addEventListener('deviceready', app.onDeviceReady, false);
//
//
//    },
//    // deviceready Event Handler
//    //
//    // The scope of 'this' is the event. In order to call the 'receivedEvent'
//    // function, we must explicitly call 'app.receivedEvent(...);'
//    onDeviceReady: function() {
//        console.info('Device is ready');
//        //document.addEventListener('menubutton', app.onMenuButton, false);
//
//    },
//
//    onMenuButton: function() {
//        alert('FIRED');
//        setTimeout(function() {
//            console.info('fired');
//
//            //  $('body').scope().$broadcast('menubutton-pressed');
//        });
//    }
//
//};

//app.initialize();
var appIsOnline = false;
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    $(function() {
        $("#main_page").width($(window).width());
    });
}

// device APIs are available
//
function onDeviceReady() {
    // Register the event listener
    document.addEventListener("backbutton", backBtnPressed, true);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("searchbutton", Dummy, false);
    document.addEventListener("volumedownbutton", Dummy, false);

    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);


    setTimeout(function() {
        $(".system-menu").css('opacity', 1);
    }, 2000);

    setTimeout(function(){
        Log("Hiding splash screen..");
        navigator.splashscreen.hide();
    }, 100);

    window.__DeviceIsReady = true;
    $('body').scope().$broadcast('DeviceIsReady');
    $('body').scope().$state.go('lang_select');
    setTimeout(function() {
        $("#startBlend").fadeOut(300, function() {
            $("#startBlend").remove();
        });
    }, 300);

    setTimeout(function() {
        if ((/iPhone OS ([7-9]|(10))/).test(navigator.userAgent)) {
            window.iOS7 = true;
            $('body').scope().$broadcast('iOS-detected');
        }

    }, 0);

    // В первый раз показываем пользователю диалог, спрашиваем согласие
    var agreement = localStorage.getItem('usageAgreement');
    if (agreement == null) {
        if (confirm("Данное приложение сохраняет контент на Вашем устройстве. Подтвердите ваше согласие.\nThis application stores the content on your device. Please confirm your agreement.")) {
            localStorage.setItem('usageAgreement', true);
        } else {
            navigator.app.exitApp();
        }
    }
}

// Handle the menu button
//

function Dummy() {

}

function backBtnPressed() {
    setTimeout(function() {
        Log('Backbutton pressed');
        $('body').scope().$broadcast('backbutton-pressed', {
            callback: function () {
                history.back();
            }
        });
    });
}

function onMenuKeyDown() {
    setTimeout(function() {
        $('body').scope().$broadcast('menubutton-pressed');
        $(".burger-menu").toggleClass('active');
    });
}

function onOnline() {
    window.appIsOnline = true;
    Log('isOnline');
    setTimeout(function() {
        $('body').scope().$broadcast('appIsOnline');
    });
}

function onOffline() {
    window.appIsOnline = false;
    Log('isOffline');
    setTimeout(function() {
        $('body').scope().$broadcast('appIsOffline');
    });
}

function showFilter() {
    $('.entity-filter').fadeToggle(300);
    $('.entity-filter-blend').fadeToggle(300);
    $('.filterBtn').toggleClass('active');
}

/**
 * Предзагрузка файлов стилей
 */
$(function() {
    var files = ['audio', 'audios', 'calendar', 'city-select', 'editors_choice',
        'event', 'events', 'favorites', 'lang-select', 'map', 'object', 'objects',
        'route', 'routes', 'search', 'selection_item', 'weather'];
    var $container = $('<div style="display:none;">');
    for(var i = 0; i < files.length; i++) {
        $container.append('<link rel="stylesheet" type="text/css" href="css/' + files[i] + '.css" />');
    }
    $('body').append($container);
    setTimeout(function() {
        $container.remove();
    }, 1000);

});

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}

function closeMenu() {
    setTimeout(function(){
        $('body').scope().$broadcast('close-menu');
    }, 200);
}

function reloadPageImages() {
    $('body').scope().$broadcast('reloadImages');
}