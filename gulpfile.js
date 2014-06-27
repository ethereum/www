var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    es      = require('event-stream');

var plugins = require('gulp-load-plugins')({
  camelize: true
});

var config = require('./gulpfile.config');

// Default values
var isProduction = false;

if(gutil.env.prod === true) {
    isProduction = true;
}

gulp.task('clean', function() {
  return gulp.src(config.basePaths.dest)
  .pipe(plugins.clean());
});

gulp.task('templates', ['scripts', 'styles'], function() {
  return gulp.src(config.appFiles.templates, {cwd: config.typePaths.templates.src})
  // .pipe(plugins.watch())
  // .pipe(plugins.plumber())
  .pipe(plugins.jade({ pretty: (isProduction ? false : true) }))

  .pipe(plugins.inject(
    gulp.src(config.typePaths.styles.dest + config.GLOBSTAR, {read: false})
    .pipe(plugins.order(config.styleOrder))
    .pipe(plugins.using({prefix: 'Injecting'})),
      { addRootSlash: false, ignorePath: 'build/' })
  )
  .pipe(plugins.inject(
    gulp.src(config.typePaths.scripts.dest + config.GLOBSTAR, {read: false})
    .pipe(plugins.order(config.scriptOrder))
    .pipe(plugins.using({prefix: 'Injecting'})),
      { addRootSlash: false, ignorePath: 'build/' })
  )

  .pipe(plugins.size({title: 'templates', showFiles: true, gzip: true}))
  .pipe(gulp.dest(config.typePaths.templates.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());

});

gulp.task('styles', function() {
  return es.merge(

    gulp.src(config.typeMap.less, {cwd: config.typePaths.styles.src})
    // .pipe(plugins.watch())
    // .pipe(plugins.plumber())
    .pipe(plugins.less()),
 
    gulp.src(config.typeMap.css, {cwd: config.typePaths.styles.src}))
    // .pipe(plugins.watch())
    // .pipe(plugins.plumber())

  .pipe(isProduction ? plugins.csso() : gutil.noop())
  .pipe(plugins.concat('app.min.css'))
  .pipe(plugins.size({title: 'styles', showFiles: true}))
  .pipe(gulp.dest(config.typePaths.styles.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());
});

gulp.task('scripts', function() {
  return es.merge(
    es.merge(

      gulp.src(config.typeMap.coffee, {cwd: config.typePaths.scripts.src})
      // .pipe(plugins.watch())
      // .pipe(plugins.plumber())
      .pipe(plugins.coffee()),

      gulp.src(config.typeMap.js, {cwd: config.typePaths.scripts.src}))
      // .pipe(plugins.watch())
      // .pipe(plugins.plumber())

    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(isProduction ? plugins.uglify() : gutil.noop())
    .pipe(plugins.concat('app.min.js')),

    gulp.src(config.typeMap.jslibs, {cwd:config.typePaths.scripts.src}))
    // .pipe(plugins.watch())
    // .pipe(plugins.plumber())

  .pipe(plugins.size({title: 'scripts', showFiles: false}))
  .pipe(gulp.dest(config.typePaths.scripts.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());
});

gulp.task('images', function() {
  return gulp.src(config.appFiles.images, {cwd: config.typePaths.images.src})
  // .pipe(plugins.watch())
  // .pipe(plugins.plumber())
  .pipe(isProduction ? plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }) : gutil.noop())
  .pipe(plugins.size({title: 'imagemin', showFiles: false}))
  .pipe(gulp.dest(config.typePaths.images.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());
});

gulp.task('extras', function() {
  return gulp.src(config.appFiles.extras, {cwd: config.typePaths.extras.src})
  // .pipe(plugins.watch())
  // .pipe(plugins.plumber())
  .pipe(plugins.size({title: 'extras', showFiles: false}))
  .pipe(gulp.dest(config.typePaths.extras.dest))
  .pipe(isProduction ? gutil.noop() : plugins.connect.reload());
});

gulp.task('bundle', function () {
  var date = new Date();
  var nicedate = date.toISOString().replace(/(\-|:|\.)/g, '');
  var archiveName = 'archive-'+ nicedate +'.zip'
  console.log(archiveName);
    return gulp.src(config.basePaths.dest + config.GLOBSTAR)
        .pipe(plugins.zip(archiveName))
        .pipe(gulp.dest(config.basePaths.src + '..'));
});


gulp.task('watch', function() {
  plugins.connect.server({
    livereload: true,
    port: config.SERVER_PORT,
    root: config.basePaths.dest
  });

  gulp.watch(config.typePaths.styles.src + config.GLOBSTAR, ['styles']);
  gulp.watch(config.typePaths.scripts.src + config.GLOBSTAR, ['scripts']);
  gulp.watch(config.typePaths.templates.src + config.GLOBSTAR, ['templates']);
  gulp.watch(config.typePaths.images.src + config.GLOBSTAR, ['images']);
  gulp.watch(config.typePaths.extras.src + config.GLOBSTAR, ['extras']);

});

gulp.task('open', ['templates'], function(){
  var uri = 'http://localhost:' + config.SERVER_PORT;
  var sourceFile = config.basePaths.src + '../README.md';

  if (!isProduction) gutil.log('Loading content at', uri);
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

