const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("src/script/tsconfig.json");
const concat = require('gulp-concat');
const order = require('gulp-order');
const replace = require('gulp-string-replace');
const clean = require('gulp-clean');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const stripImportExport = require('gulp-strip-import-export');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

gulp.task("tsc", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

gulp.task('concat', function() {
    return gulp.src('dist/**/*.js')
    .pipe(order([
        'dist/**/*.js',
        'dist/main.js'
        ], { base: __dirname }))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('vendorcss', function(done){
    gulp.src(['vendor/node_modules/**/*.min.css', 
                '!vendor/node_modules/**/*-grid.*', 
                '!vendor/node_modules/**/*-reboot.*'], 
                { sourcemaps: true })
         .pipe(rename({dirname: ''})) 
        .pipe(gulp.dest('dist/vendor/css', 
            { sourcemaps: '.' }));
        done();
});

gulp.task('vendorjs', function(done){
    gulp.src(['vendor/node_modules/**/*.min.js', 
                '!vendor/node_modules/**/*.bundle.*', 
                '!vendor/node_modules/**/*.slim.*', 
                '!vendor/node_modules/**/external/**/*.js'], 
                { sourcemaps: true })
        .pipe(rename({dirname: ''})) 
        .pipe(gulp.dest('dist/vendor/js', 
            { sourcemaps: '.' }));
        done();
});

gulp.task('assets', function(done){
            gulp.src(['assets/**/*.png',
                      'assets/**/*.ico',
                      'assets/**/*.xml',
                      'assets/**/*.json',
                      'assets/**/*.jpg'], {
                        encoding: false,
                      })
            .pipe(gulp.dest('dist/assets'))
        done();
});

gulp.task('competences', function(done){
    gulp.src(['assets/**/competences.json'])
    .pipe(rename({dirname: ''})) 
    .pipe(gulp.dest('dist/'))
done();
});


gulp.task('clean', function(done){
    gulp.src('dist/*')
        .pipe(clean({force: true}));
        done();
});

gulp.task('remove-imports-exports', function(done){
    return gulp.src(['dist/app.min.js'])
        .pipe(stripImportExport())
        .pipe(gulp.dest('dist'));
        done();
});

gulp.task('uglify', function () {
    var options = {
        mangle: {
            toplevel: true,
        },
        compress: {
            drop_console: true
        },
        output: {
            beautify: false,
            comments: false,
        }
    };
    return gulp.src('dist/app.min.js')
        .pipe(uglify())
        .pipe(replace('../../assets/competences', ''))
        .pipe(replace('../../assets/img', 'assets/img'))
        .pipe(gulp.dest('dist/'))
});

gulp.task('minify-css', function(done){
    return gulp.src('src/style/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('style.min.css'))
        .pipe(replace('../../assets/img', 'assets/img'))
        .pipe(gulp.dest('dist'));
});

gulp.task('index', function(done){
    return gulp.src('index.html')
    .pipe(replace('../../assets/img', 'assets/img'))
    .pipe(replace('dist/images/img', 'assets/img'))
    .pipe(replace('dist/images/favicon', 'assets/favicon'))
    .pipe(replace('dist/images', 'assets/img'))
    .pipe(replace('dist', '.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function(done) {
    var tasks = gulp.series('clean', 'tsc', 'concat', 'clean', 'vendorcss', 'vendorjs', 'competences', 'assets', 'remove-imports-exports', 'uglify', 'minify-css', 'index');
    tasks();
    done();
})