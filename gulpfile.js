'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),// Плагин, позволяющий импортировать файлы кострукцией "//= pathToFile"
    rimraf = require('rimraf'),
    connect = require('gulp-connect'),
    opn = require('opn');


var path = {
    // Путь для файлов, прошедших сборку
    build: {
        html: 'www',
        partials: 'www/partials',
        js: 'www/js',
        css: 'www/css',
        theme: 'www/css/theme/',
        img: 'www/img',
        fonts: 'www/fonts/'
    },
    // Откуда брать исходные файлы
    src: {
        html: 'src/*.html',
        partials: 'src/partials/**/*',
        js: 'src/js/**/*',
        css: 'src/css/*.scss',
        theme: 'src/css/theme/**/*',
        img: 'src/img/**/*',
        fonts: 'src/fonts/**/*'
    },
    // Назначаем пересборку при изменении указанных файлов
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*',
        css: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        partials:  'src/partials/**/*.html'
    },

    bower_components: {
        list: {
            'bower_components/angular/angular.js': false,
            'bower_components/angular-animate/angular-animate.js': false,
            'bower_components/angular-ui-router/release/angular-ui-router.js': false,
            'bower_components/requirejs/require.js': false,
            'bower_components/jquery/jquery.js': false,
            'bower_components/angular-sanitize/angular-sanitize.min.js': false,
            'bower_components/angular-touch/angular-touch.min.js': false,
            'bower_components/ngstorage/ngStorage.min.js': false,
            'bower_components/jquery.panzoom/dist/jquery.panzoom.min.js': false,
            'bower_components/jquery-mobile-bower/': {
                folder: 'jquery-mobile',
                css:['css/jquery.mobile-1.4.5.css'],
                js: ['js/jquery.mobile-1.4.5.js'],
                img: ['css/images/**/*']
            },
            'bower_components/datetimepicker/': {
                folder: 'datetimepicker',
                js: ['jquery.datetimepicker.js'],
                css: ['jquery.datetimepicker.css'],
                img: []
            }
        }
    },
    bower_dest: {
        list: 'www/libs'
    }
};
/////////////////////////////////////////////////////////////////////////////

gulp.task('libs', function() {
    var libs = path.bower_components.list;
    Object.keys(libs).forEach(function(key){
        if (!libs[key]) {
            gulp.src(key)
                .pipe(gulp.dest(path.bower_dest.list));
        } else {

                gulp.src(libs[key]['js'].map(function(js) {return key + js}))
                    .pipe(gulp.dest(path.bower_dest.list + '/' + libs[key]['folder'] + '/js'));


            gulp.src(libs[key]['css'].map(function(css) {return key + css}))
                .pipe(gulp.dest(path.bower_dest.list + '/' + libs[key]['folder'] + '/css'));
            gulp.src(libs[key]['img'].map(function(img){ return key + img }))
                .pipe(gulp.dest(path.bower_dest.list + '/' + libs[key]['folder'] + '/css/images' ));
        }
    });

    // OWL Carousel
    gulp.src('bower_components/owl.carousel/dist/**/*')
        .pipe(gulp.dest('www/libs/owl'));

    // Font Awesome
    gulp.src('bower_components/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest('www/libs/font-awesome/css/'));
    gulp.src('bower_components/font-awesome/fonts/*.*')
        .pipe(gulp.dest('www/libs/font-awesome/fonts/'));

});

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload());
});

gulp.task('partials', function () {
    return gulp.src([path.src.partials])
        //  .pipe(rigger())
        .pipe(gulp.dest(path.build.partials));
});

gulp.task('js', function () {
    console.log( "\n\n" + '>>  Processing client files. To process bower_components, run "gulp libs".' + "\n\n");

    gulp.src(path.src.js)
        //     .pipe(sourcemaps.init())
        // .pipe(uglify())
        //   .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src(path.src.css)
        .pipe(rigger())
        //  .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        //  .pipe(cssmin())
        //  .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload());
});

gulp.task('theme', function () {
    gulp.src(path.src.theme)
        .pipe(gulp.dest(path.build.theme))
        .pipe(connect.reload());
});

// gulp.task('css', function () {
//  return sass(path.src.css, {})
//  .pipe(gulp.dest(path.build.css))
// });

gulp.task('img', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(connect.reload());
});

gulp.task('fonts', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(connect.reload());
});








/////////////////////////////////////////////////////////////////////////////
gulp.task('build', [
    'html',
    'js',
    'css',
    'theme',
    'fonts',
    'partials',
    'img'
]);

gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.partials], function(event, cb) {
        gulp.start('partials');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img');
    });
});

gulp.task('default', ['build', 'watch']);