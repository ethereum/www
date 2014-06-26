var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    es      = require('event-stream');

var plugins = require('gulp-load-plugins')({
  camelize: true
  // pattern: ['gulp-*', 'gulp.*'],
  // replaceString: /\bgulp[\-.]/
});

// Default values
var isProduction = false;
var jadePretty = true;

if(gutil.env.prod === true) {
    isProduction = !isProduction;
    jadePretty = !jadePretty;
}

var basePaths = {
  src: 'src/',
  dest: 'build'
};

var typePaths = {
  templates: {
    src: basePaths.src + 'templates/',
    dest: basePaths.dest + ''
  },
  styles: {
    src: basePaths.src + 'styles/',
    dest: basePaths.dest + '/styles'
  },
  scripts: {
    src: basePaths.src + 'scripts/',
    dest: basePaths.dest + '/scripts'
  },
  images: {
    src: basePaths.src + 'images/',
    dest: basePaths.dest + '/images'
  },
  extras: {
    src: basePaths.src + '/extras',
    dest: basePaths.dest + ''
  }
};

var typeMap = {
  // templates
  jade:       ['*.jade'],

  // styles
  css:        ['**/*.css'],
  less:       ['**/*.less'],

  // scripts
  js:         ['**/*.js', '!libs/**/*.js'],
  coffee:     ['**/*.coffee'],
  jslibs:     ['libs/**/*.js'],

  // images
  png:        ['**/*.png'],
  jpg:        ['**/*.jpg', '**/*.jpeg'],
  gif:        ['**/*.gif'],

  // extras
  extras:   ['**/*']

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

gulp.task('clean', function() {
  return gulp.src(basePaths.dest)
  .pipe(plugins.clean());
});

gulp.task('templates', ['scripts', 'styles'], function() {
  return gulp.src(appFiles.templates, {cwd: typePaths.templates.src})
  .pipe(plugins.jade({ pretty: jadePretty }))

  .pipe(plugins.inject(
    gulp.src(typePaths.styles.dest + '/**/*', {read: false})
    .pipe(plugins.order(styleOrder))
    .pipe(plugins.using({prefix: 'Injecting'})),
      { addRootSlash: false, ignorePath: 'build/' })
  )
  .pipe(plugins.inject(
    gulp.src(typePaths.scripts.dest + '/**/*', {read: false})
    .pipe(plugins.order(scriptOrder))
    .pipe(plugins.using({prefix: 'Injecting'})),
      { addRootSlash: false, ignorePath: 'build/' })
  )

  .pipe(plugins.size({title: 'templates', showFiles: true}))
  .pipe(gulp.dest(typePaths.templates.dest))
  .on('error', function(err){
    new gutil.PluginError('templates', err, {showStack: true});
  });
});

gulp.task('styles', function() {
  return es.merge(
    gulp.src(typeMap.less, {cwd: typePaths.styles.src})
    .pipe(plugins.less()),
    gulp.src(typeMap.css, {cwd: typePaths.styles.src}))
  // .pipe(isProduction ? gutil.noop() : plugins.livereload(server()))
  .pipe(isProduction ? plugins.csso() : gutil.noop())
  .pipe(plugins.concat('app.min.css'))
  .pipe(plugins.size({title: 'styles', showFiles: true}))
  .pipe(gulp.dest(typePaths.styles.dest));
});

gulp.task('scripts', function() {
  return es.merge(
    es.merge(
      gulp.src(typeMap.coffee, {cwd: typePaths.scripts.src})
      .pipe(plugins.coffee()),
      gulp.src(typeMap.js, {cwd: typePaths.scripts.src}))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(isProduction ? plugins.uglify() : gutil.noop())
    .pipe(plugins.concat('app.min.js')),
    gulp.src(typeMap.jslibs, {cwd:typePaths.scripts.src}))
  .pipe(plugins.size({title: 'scripts', showFiles: false}))
  // .pipe(isProduction ? gutil.noop() : plugins.livereload(server()))
  .pipe(gulp.dest(typePaths.scripts.dest))
  .on('error', function(err){
    new gutil.PluginError('scripts', err, {showStack: true});
  });
});

gulp.task('images', function() {
  return gulp.src(appFiles.images, {cwd: typePaths.images.src})
  .pipe(isProduction ? plugins.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }) : gutil.noop())
  .pipe(plugins.size({title: 'imagemin', showFiles: false}))
  // .pipe(isProduction ? gutil.noop() : plugins.livereload(server()))
  .pipe(gulp.dest(typePaths.images.dest));
});

gulp.task('extras', function() {
  return gulp.src(appFiles.extras, {cwd: typePaths.extras.src})
  .pipe(plugins.size({title: 'extras', showFiles: false}))
  // .pipe(isProduction ? gutil.noop() : plugins.livereload(server()))
  .pipe(gulp.dest(typePaths.extras.dest));
});



// A development task to run anytime a file changes
gulp.task('watch', function() {
  var server = plugins.livereload();

  gulp.watch(basePaths.dest + '/**').on('change', function(file) {
    server.changed(file.path);
  });

  // server.listen(1337, function(err){
  //   if (err) return console.log(err);

  //   gulp.watch(appFiles.scripts, ['scripts']);
  //   gulp.watch(appFiles.styles, ['styles']);
  //   gulp.watch(appFiles.templates, ['templates']);
  //   gulp.watch(appFiles.images, ['images']);
  //   gulp.watch(appFiles.extras, ['extras']);
  // });
});

// Define the default task as a sequence of the above tasks
// invode production build with "--prod"
gulp.task('default', ['clean'], function(){
  gulp.start('scripts', 'styles', 'extras', 'images', 'templates');
});

