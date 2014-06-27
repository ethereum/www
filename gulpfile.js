var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    es      = require('event-stream');

var plugins = require('gulp-load-plugins')({
  camelize: true
});

// Default values
var isProduction = false;

if(gutil.env.prod === true) {
    isProduction = true;
}

var basePaths = {
  src: 'src/',
  dest: 'build/'
};

var GLOBSTAR = '**/*';

var typePaths = {
  templates: {
    src: basePaths.src + 'templates/',
    dest: basePaths.dest + ''
  },
  styles: {
    src: basePaths.src + 'styles/',
    dest: basePaths.dest + 'styles/'
  },
  scripts: {
    src: basePaths.src + 'scripts/',
    dest: basePaths.dest + 'scripts/'
  },
  images: {
    src: basePaths.src + 'images/',
    dest: basePaths.dest + 'images/'
  },
  extras: {
    src: basePaths.src + 'extras/',
    dest: basePaths.dest + ''
  }
};

var typeMap = {
  // templates
  jade:       ['*.jade'],

  // styles
  css:        [GLOBSTAR + '.css'],
  less:       [GLOBSTAR + '.less'],

  // scripts
  js:         [GLOBSTAR + '.js', '!libs/**/*.js'],
  coffee:     [GLOBSTAR + '.coffee'],
  jslibs:     ['libs/**/*.js'],

  // images
  png:        [GLOBSTAR + '.png'],
  jpg:        [GLOBSTAR + '.jpg', GLOBSTAR + '.jpeg'],
  gif:        [GLOBSTAR + '.gif'],

  // extras
  extras:   [GLOBSTAR]

};

var appFiles = {
  templates:  typeMap.jade,
  styles:     typeMap.css.concat(typeMap.less),
  scripts:    typeMap.js.concat(typeMap.coffee),
  images:     typeMap.png.concat(typeMap.gif).concat(typeMap.jpg),
  extras:     typeMap.extras
};

var vendorFiles = {
  scripts:    typeMap.jslibs
};

var scriptOrder = [
  'jquery-2.1.0.min.js',
  'jquery.countdown.min.js',
  'jquery.easing.1.3.js',
  'jquery.scrollUp.min.js',
  'jquery.touchSwipe.min.js',
  'jquery.liquid-slider-custom.min.js',
  'd3.min.js',
  'd3_tooltip.js',
  'nano.scroller.min.js',
  'topojson.v1.min.js',
  'meetupmap.js',
  'video-background.js',
  'bootstrap.min.js',
  'jquery.knob.js',
  'numeral.js',
  'underscore-min.js',
  'moment.min.js',
  'jquery.PrintArea.js',
  'ethersale/angular.min.js',
  'qrcode.min.js',
  'main.js',

  'ethersale/jquery.qrcode.min.js',
  'ethersale/bitcoinjs-min.js',
  'ethersale/aes.js',
  'ethersale/pbkdf2.js',
  'ethersale/sha256.js',
  'ethersale/sha3.js',
  'ethersale/xethtool.js',
  'ethersale/base64.js',
  'ethersale/angular-animate.min.js',
  'ethersale/angular-resource.min.js',
  'ethersale/angular-route.min.js',
  'ethersale/jquery-1.10.2.min.js',
  'jquery.fitvids.js',
  'Chart.min.js',
  'ethersale/app.js',
  'ethersale/password-dict.js'
];

var styleOrder = [
  'bootstrap.min.css',
  'bootstrap-theme.min.css',
  'font-awesome.min.css',
  'liquid-slider.css',
  'animate.css',
  'roboto.css',
  'zocial.css',
  'meetupmap.css',
  'printclearly.css',
  'style.css',
  'app.min.css'
];


var SERVER_PORT = 1337;

gulp.task('clean', function() {
  return gulp.src(basePaths.dest)
  .pipe(plugins.clean());
});

gulp.task('templates', ['scripts', 'styles'], function() {
  return gulp.src(appFiles.templates, {cwd: typePaths.templates.src})
  // .pipe(plugins.watch())
  // .pipe(plugins.plumber())
  .pipe(plugins.jade({ pretty: (isProduction ? false : true) }))

  .pipe(plugins.inject(
    gulp.src(typePaths.styles.dest + GLOBSTAR, {read: false})
    .pipe(plugins.order(styleOrder))
    .pipe(plugins.using({prefix: 'Injecting'})),
      { addRootSlash: false, ignorePath: 'build/' })
  )
  .pipe(plugins.inject(
    gulp.src(typePaths.scripts.dest + GLOBSTAR, {read: false})
    .pipe(plugins.order(scriptOrder))
    .pipe(plugins.using({prefix: 'Injecting'})),
      { addRootSlash: false, ignorePath: 'build/' })
  )

  .pipe(plugins.size({title: 'templates', showFiles: true}))
  .pipe(gulp.dest(typePaths.templates.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());

});

gulp.task('styles', function() {
  return es.merge(

    gulp.src(typeMap.less, {cwd: typePaths.styles.src})
    // .pipe(plugins.watch())
    // .pipe(plugins.plumber())
    .pipe(plugins.less()),
 
    gulp.src(typeMap.css, {cwd: typePaths.styles.src}))
    // .pipe(plugins.watch())
    // .pipe(plugins.plumber())

  .pipe(isProduction ? plugins.csso() : gutil.noop())
  .pipe(plugins.concat('app.min.css'))
  .pipe(plugins.size({title: 'styles', showFiles: true}))
  .pipe(gulp.dest(typePaths.styles.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());
});

gulp.task('scripts', function() {
  return es.merge(
    es.merge(

      gulp.src(typeMap.coffee, {cwd: typePaths.scripts.src})
      // .pipe(plugins.watch())
      // .pipe(plugins.plumber())
      .pipe(plugins.coffee()),

      gulp.src(typeMap.js, {cwd: typePaths.scripts.src}))
      // .pipe(plugins.watch())
      // .pipe(plugins.plumber())

    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(isProduction ? plugins.uglify() : gutil.noop())
    .pipe(plugins.concat('app.min.js')),

    gulp.src(typeMap.jslibs, {cwd:typePaths.scripts.src}))
    // .pipe(plugins.watch())
    // .pipe(plugins.plumber())

  .pipe(plugins.size({title: 'scripts', showFiles: false}))
  .pipe(gulp.dest(typePaths.scripts.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());
});

gulp.task('images', function() {
  return gulp.src(appFiles.images, {cwd: typePaths.images.src})
  // .pipe(plugins.watch())
  // .pipe(plugins.plumber())
  .pipe(isProduction ? plugins.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }) : gutil.noop())
  .pipe(plugins.size({title: 'imagemin', showFiles: false}))
  .pipe(gulp.dest(typePaths.images.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());
});

gulp.task('extras', function() {
  return gulp.src(appFiles.extras, {cwd: typePaths.extras.src})
  // .pipe(plugins.watch())
  // .pipe(plugins.plumber())
  .pipe(plugins.size({title: 'extras', showFiles: false}))
  .pipe(gulp.dest(typePaths.extras.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());
});

});


gulp.task('watch', function() {
  plugins.connect.server({
    livereload: true,
    port: SERVER_PORT,
    root: basePaths.dest
  });

  gulp.watch(typePaths.styles.src + GLOBSTAR, ['styles']);
  gulp.watch(typePaths.scripts.src + GLOBSTAR, ['scripts']);
  gulp.watch(typePaths.templates.src + GLOBSTAR, ['templates']);
  gulp.watch(typePaths.images.src + GLOBSTAR, ['images']);
  gulp.watch(typePaths.extras.src + GLOBSTAR, ['extras']);

});

gulp.task('open', ['templates'], function(){
  var uri = 'http://localhost:' + SERVER_PORT;
  var sourceFile = basePaths.src + '../README.md';

  if (isProduction) gutil.log('Loading content at', uri);
  gulp.src(sourceFile)
  .pipe(isProduction ? gutil.noop() : plugins.open('', {url: uri}));
});

// Define the default task as a sequence of the above tasks
// Additionally, mimic production build on any task with "--prod"
gulp.task('build', ['clean'], function(){
  gulp.start('extras', 'scripts', 'styles', 'images', 'templates');
});

gulp.task('default', ['clean'], function(){
  gulp.start('extras', 'scripts', 'styles', 'images', 'templates', 'watch', 'open');
});

gulp.task('prod', ['clean'], function(){
  isProduction = true;
  gulp.start('build');
});

