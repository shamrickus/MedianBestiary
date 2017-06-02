var gulp = require("gulp");
var gulpSass = require("gulp-sass");
var gulpTsc = require("gulp-typescript");

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
}

gulp.task("tsc", tsc);
function tsc() {
	var tsProject = gulpTsc.createProject("tsconfig.json");

	var sourceFiles = ["./_all.ts"].concat(watchDirs.map(x => x + "*.ts"));

	return gulp.src(sourceFiles, { base: "." })
		.pipe(tsProject())
		.js
		.pipe(gulp.dest("."));
}

gulp.task("default", ["sass", "tsc"]);
