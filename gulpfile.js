var gulp = require("gulp");
var gulpSass = require("gulp-sass");
var gulpTsc = require("gulp-typescript");
var livereload = require('gulp-livereload');

var watchDirs = [
	"./style/**/",
	"./script/**/"
];

gulp.task("sass", sass);
function sass() {
	var sourceFiles = watchDirs.map(x => x + "**.scss");

	return gulp.src(sourceFiles, { base: "." })
		.pipe(gulpSass({ outputStyle: "compressed" }).on('error', gulpSass.logError))
		.pipe(gulp.dest("."));
		.pipe(livereload());
}

gulp.task("tsc", tsc);
function tsc() {
	var tsProject = gulpTsc.createProject("tsconfig.json");

	var sourceFiles = ["./_all.ts"].concat(watchDirs.map(x => x + "*.ts"));

	return gulp.src(sourceFiles, { base: "." })
		.pipe(tsProject())
		.js
		.pipe(gulp.dest("."))
		.pipe(livereload());
}

gulp.task('watch', function() {
	livereload.listen();
	var watches = ["**/**.ts", "**/**.scss"];
	gulp.watch(watches, ["default"]);
})

gulp.task("default", ["sass", "tsc"]);
