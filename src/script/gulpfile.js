var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var concat = require('gulp-concat');
var order = require('gulp-order');
var replace = require('gulp-replace');
var filter = require('gulp-filter');
var clean = require('gulp-clean');

gulp.task("tsc", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("../../dist"));
});

gulp.task('concat', function() {
    return gulp.src('../../dist/**/*.js')
    .pipe(order([
        '../../dist/classes/*.js',
        '../../dist/main.js'
        ], { base: __dirname }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('../../dist'));
});

gulp.task('remove-imports', function(done){
    gulp.src('../../dist/app.js')
        .pipe(replace(/import[^\n]*/g, ''))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('../../dist'));
        done();
});

gulp.task('clean', function(done){
        gulp.src('../../dist/*')
            .pipe(clean({force: true}));
            done();
});


gulp.task('build', function(done) {
    var tasks = gulp.series('tsc', 'concat', 'remove-imports', 'clean');
    tasks();
    done();
})