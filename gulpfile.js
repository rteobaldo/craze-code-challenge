var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('styles', function () {
  return gulp
  .src('./src/sass/**/*.scss')
  .pipe($.sass({
    includePaths: ['./node_modules']
  }).on('error', $.sass.logError))
  .pipe($.autoprefixer('defaults'))
  .pipe($.cleanCss())
  .pipe(gulp.dest('public/css'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('vendorScripts', function() {
  gulp.src('./src/js/vendor/**/*.js')
    .pipe(gulp.dest('public/js/vendor'));
});

gulp.task('scripts', function () {
  return gulp.src([
    './src/js/!(vendor)**/!(main)*.js',
    './src/js/carousel.js',
    './src/js/main.js'
  ])
  .pipe($.plumber())
  .pipe($.babel({
    presets: ['env']
  }))
  .pipe($.concat('main.js'))
  .pipe($.uglify())
  .pipe(gulp.dest('public/js'))
  .pipe(browserSync.reload({stream: true}));
} );

// Optimizes the images that exists
gulp.task('images', function () {
  return gulp
  .src('src/images/**')
  .pipe($.changed('images'))
  .pipe($.imagemin({
    // Lossless conversion to progressive JPGs
    progressive: true,
    // Interlace GIFs for progressive rendering
    interlaced: true
  } ) )
  .pipe(gulp.dest( 'public/images'))
  .pipe($.size({title: 'images'}));
} );

gulp.task('html', function () {
  return gulp
  .src('./src/**/*.html')
  .pipe(gulp.dest('public/'))
} );

gulp.task('browser-sync', ['styles', 'scripts'], function () {
  browserSync({
  server: {
    baseDir: './public/',
    injectChanges: true // this is new
  }
  });
});

gulp.task('deploy', function () {
  return gulp.start(
    'styles',
    'vendorScripts',
    'scripts',
    'images',
    'html'
  );
});

gulp.task('watch', function () {
  // Watch .html files
  gulp.watch('src/**/*.html', ['html', browserSync.reload]);
  gulp.watch('public/*.html').on( 'change', browserSync.reload);
  // Watch .sass files
  gulp.watch('src/sass/**/*.scss', ['styles', browserSync.reload]);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts', browserSync.reload]);
  // Watch .js files
  gulp.watch('src/js/vendor/*', ['vendorScripts', browserSync.reload]);
  // Watch image files
  gulp.watch('src/images/**/*', ['images', browserSync.reload]);
});

gulp.task('default', function () {
  gulp.start(
  'styles',
  'vendorScripts',
  'scripts',
  'images',
  'html',
  'browser-sync',
  'watch'
  );
});
