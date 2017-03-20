// Gulp
const gulp = require('gulp');
// Concatenador
const concat = require('gulp-concat');
// Sincronizador de navegador
const browserSync = require('browser-sync').create();
// Para minificar usamos uglify y pump
const uglify = require('gulp-uglify');
const pump = require('pump');

// Inyector para elegir entre minificado o no
const inject = require('gulp-inject')

// Importamos las listas de scripts y estilos...
const scripts = require('./scripts');
const styles = require('./styles');

// Procesar los css
gulp.task('css', function() {
  // Procesamos la lista completa de estilos,
  // los concatenamos en el fichero main.css y
  // lo enviamos a dist/css
  gulp.src(styles)
      .pipe(concat('main.css'))
      .pipe(gulp.dest('./dist/css/'))
      .pipe(browserSync.reload({
          stream: true
      }));
});

// Procesamos los JS
gulp.task('js', function() {
  gulp.src(scripts)
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest('./dist/js/'))
      .pipe(browserSync.reload({
          stream: true
      }));
});

// Procesamos los templates HTML y los metemos en /dist
gulp.task('html', function() {
  gulp.src('./src/templates/**/*.html')
      .pipe(gulp.dest('./dist/'))
      .pipe(browserSync.reload({
          stream: true
      }));
});

// Cuando ejecutamos gulp, ejecutamos el array task a task
gulp.task('build', function() {
  gulp.start(['css', 'js', 'html']);
});

// Configuramos el browser-sync
gulp.task('browser-sync',['inject'], function() {
  browserSync.init(null, {
    open: false,
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('minify', ['build'], function(cb) {
  pump([
        gulp.src('./dist/js/scripts.js'),
        uglify(),
        gulp.dest('./dist/js/min')
    ],
    cb
  );
})

// Cuando ejecutamos el devMode, usamos esta task
gulp.task('start', function() {
  // Ejecutamos el build (que hace la compilación, y luego sincronizamos
  gulp.start(['build', 'browser-sync']);
  // Cuando detectamos cambios en las carpetas... realizamos la tarea que viene en el array
  gulp.watch(['./src/css/**/*.css'], ['css']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
  gulp.watch(['./src/templates/**/*.html'], ['html']);
});

gulp.task('inject', ['minify'], function() {
  devMode = true;
  if(!devMode) {
    injectSrc = gulp.src(['./dist/js/min/**/*.js'], {read: false});
  }
  else {
    injectSrc = gulp.src(['./dist/js/min/**/*.js'], {read: false});
  }
  //gulp.src('./dist/**/*.html')
  //    .pipe(inject(injectSrc))
  //    .pipe(gulp.dest('./dist/'));
  return gulp.src('./dist/**/*.html').pipe(inject(injectSrc)).pipe(gulp.dest('./dist'));

});

gulp.task('deployStart', function() {
  // Ejecutamos el build (que hace la compilación, minifamos y luego sincronizamos
  gulp.start(['build', 'minify', 'inject', 'browser-sync']);
  // Cuando detectamos cambios en las carpetas... realizamos la tarea que viene en el array
  gulp.watch(['./src/css/**/*.css'], ['css']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
  gulp.watch(['./src/templates/**/*.html'], ['html']);
});
