import gulp from 'gulp';
import ts from 'gulp-typescript';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';

//Initialise browser sync
const bs = browserSync.create();
// Load TypeScript config
const tsProject = ts.createProject('tsconfig.json');

// 1️⃣ Clean the `dist/` folder before every build
export function clean() {
  return deleteAsync(['dist/**/*']);
}

// 2️⃣ Compile TypeScript to JavaScript
export function scripts() {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('dist'));
}

// 3️⃣ Copy `index.html` and `css` files to `dist/`
export function copyHtml() {
  return gulp.src('index.html')
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
}

export function copyCss() {
  return gulp.src('css/**/*')
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream());
}

// 4️⃣ Watch for changes in TypeScript, HTML, and CSS files
export function watchFiles() {
  bs.init({
    server: {
      baseDir: 'dist',
    },
    notify: false,
  });

  gulp.watch('src/**/*.ts', gulp.series(scripts, reload));
  gulp.watch('index.html', copyHtml);
  gulp.watch('css/**/*.css', copyCss);
}

// 5️⃣ Reload BrowserSync
function reload(done) {
  bs.reload();
  done();
}

// 6️⃣ Default Task (Run all tasks in sequence)
export default gulp.series(clean, gulp.parallel(scripts, copyHtml, copyCss), watchFiles);
