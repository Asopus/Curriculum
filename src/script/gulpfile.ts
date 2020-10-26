const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const concat = require('gulp-concat');
const order = require('gulp-order');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const stripImportExport = require('gulp-strip-import-export');
const cleanCSS = require('gulp-clean-css');

gulp.task("tsc", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("../../dist"));
});

gulp.task('concat', function() {
    return gulp.src('../../dist/**/*.js')
    .pipe(order([
        '../../dist/**/*.js',
        '../../dist/main.js'
        ], { base: __dirname }))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('../../dist'));
});

gulp.task('remove-imports', function(done){
    gulp.src('../../dist/app.min.js')
        .pipe(replace(/import[^\n]*/g, ''))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('../../dist'));
        done();
});

gulp.task('clean', function(done){
    gulp.src('../../dist/*')
        .pipe(clean({force: true}));
        done();
});

gulp.task('remove-imports-exports', function(done){
    return gulp.src(['../../dist/app.min.js'])
        .pipe(stripImportExport())
        .pipe(gulp.dest('../../dist'));
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
    return gulp.src('../../dist/app.min.js')
        .pipe(uglify())
        .pipe(gulp.dest('../../dist/'))
});

gulp.task('minify-css', function(done){
    return gulp.src('../../src/style/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('../../dist'));
});

gulp.task('build', function(done) {
    var tasks = gulp.series('clean', 'tsc', 'concat', 'clean', 'remove-imports-exports', 'uglify', 'minify-css');
    tasks();
    done();
})