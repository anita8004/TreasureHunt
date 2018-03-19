
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const mainBowerFiles = require('main-bower-files');
const browserSync = require('browser-sync');
const autoprefixer = require('autoprefixer');
const minimist = require('minimist'); // 用來讀取指令轉成變數
const gulpSequence = require('gulp-sequence').use(gulp);

// production || development
// # gulp --env production
const envOptions = {
  string: 'env',
  default: { env: 'development' }
};
const options = minimist(process.argv.slice(2), envOptions);
console.log(options);

gulp.task('clean', function () {
  return gulp.src(['./public', './.tmp'], { read: false })
    .pipe($.clean());
});


gulp.task('pug', function () {
  return gulp.src(['./source/**/*.html','./source/**/*.pug'])
    .pipe($.plumber())
    // .pipe($.data(function (file) {
    //   var json = require('./source/data/data.json');
    //   var menus = require('./source/data/menu.json');
    //   var source = {
    //     data: json,
    //     menus: menus
    //   }
    //   return source;
    // }))
    .pipe($.pug({ pretty: true }))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('babel', function () {
  return gulp.src(['./source/js/**/*.js'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.concat('all.js'))
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(
        $.if(options.env === 'production', $.uglify({
          compress: {
            drop_console: true
          }
        })
      )
    )
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('bower', function () {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./.tmp/vendors'));
  cb(err);
});
gulp.task('vendorJs', ['bower'], function () {
  return gulp.src([
    './.tmp/vendors/**/**.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
  ])
  .pipe($.order([
    'jquery.js'
  ]))
  .pipe($.concat('vendor.js'))
  .pipe($.if(options.env === 'production', $.uglify()))
  .pipe(gulp.dest('./public/js'))
});

gulp.task('sass', function () {
  // PostCSS AutoPrefixer
  var processors = [
    autoprefixer({
      browsers: ['last 5 version'],
    })
  ];

  return gulp.src(['./source/css/**/*.sass', './source/css/**/*.scss'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({ 
      outputStyle: 'expanded',
      includePaths: ['./node_modules/bootstrap/scss']
    })
      .on('error', $.sass.logError))
    .pipe($.postcss(processors))
    .pipe($.if(options.env === 'production', $.minifyCss())) // 假設開發環境則壓縮 CSS
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('imageMin', function () {
  gulp.src('./source/images/*')
    .pipe($.if(options.env === 'production', $.imagemin()))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: { baseDir: './public' },
    reloadDebounce: 2000
  })
});

gulp.task('watch', function () {
  gulp.watch(['./source/css/**/*.css', './source/css/**/*.sass', './source/css/**/*.scss'], ['sass']);
  gulp.watch(['./source/**/*.html', './source/**/*.pug'], ['pug']);
  gulp.watch(['./source/js/**/*.js'], ['babel']);
});

gulp.task('deploy', function () {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});

gulp.task('sequence', gulpSequence('clean', 'pug', 'sass', 'babel', 'vendorJs', 'imageMin'));

gulp.task('default', ['pug', 'sass', 'babel', 'vendorJs', 'browserSync', 'imageMin', 'watch']);
gulp.task('build', ['sequence']);
