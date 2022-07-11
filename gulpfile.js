'use strict';

// /////////////////////////////////////////
// Required
// /////////////////////////////////////////
let 
  gulp = require('gulp'),
  del = require('del'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  imageResize = require('gulp-image-resize'),
  imagemin = require('gulp-imagemin'),
  responsive = require('gulp-responsive-images'),
  imageminJpegRecompress = require('imagemin-jpeg-recompress'),
  imageminMozjpeg = require('imagemin-mozjpeg'),
  imageminWebp = require('imagemin-webp'),
  extReplace = require("gulp-ext-replace"),
  webp = require('gulp-webp')
;

// /////////////////////////////////////////
// SVG Task
// /////////////////////////////////////////
gulp.task('cleanIcons', function () {
  return del(['public/images/icons/**', '!public/images/']);
});
gulp.task('makeSprite', function () {
  return (
    gulp
    .src('src/images/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore())
    //.pipe(svgSprite(config))
    .pipe(
      rename({
        basename: 'sprite'
      })
    )
    .pipe(gulp.dest('public/images/icons/'))
  );
});

gulp.task('svgSprite', gulp.series('cleanIcons', 'makeSprite'));

gulp.task('svgMinify', function () {
  return gulp
    .src('app/svg/topos/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('app/images/topos/'));
});

// /////////////////////////////////////////
// IMAGES Task
// /////////////////////////////////////////

// GENERATE HEADER IMAGES
gulp.task("headerImagesJpg", () => {
  //   specify different image sizes
  const sizes = [
    { width: 1000, quality: 50, suffix: "low" },
    { width: 1000, quality: 100, suffix: "high" },
  ]
  let stream
  sizes.forEach(size => {
    stream = gulp
      //     source for images to optimize
      .src("src/images/headerImages/**/*.jpg")
      //     resize image
      .pipe(imageResize({ width: size.width }))
      //       add suffix to image
      .pipe(
        rename(path => {
          path.basename += `-${size.suffix}`
        })
      )
      //     reduce image quality based on the size
      .pipe(
        imagemin(
          [
            imageminMozjpeg({
              quality: size.quality,
            })
          ],
          {
            verbose: true,
          }
        )
      )
      //     output optimized images to a destination folder
      .pipe(gulp.dest("dist/images/headerImages"))
  })
  return stream
});
gulp.task("headerImagesWebp", function() {
  //let src = "src/images/**/*.{jpg,png}"; // Where your images are coming from.
  let src = "src/images/headerImages/**/*.jpg";
  //let dest = "dist/images"; // Where your WebPs are going.
  let dest = "dist/images/headerImages";
  return gulp.src(src)
    .pipe(imagemin([
      imageminWebp({
        // lossless: true, if pngs turn out sucky uncomment this and redo just pngs
        quality: 100
      })
    ]))
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest(dest));
});
gulp.task('cleanheaderImages', function () {
  return del(['dist/images/headerImages/**']);
});
gulp.task('headerImages', gulp.series('cleanheaderImages', 'headerImagesJpg', 'headerImagesWebp'));


gulp.task('areaImagesWebp', () =>
  gulp
    .src('src/images/areas/**/*.jpg')
    .pipe(imageResize({ width: 320 }))
    .pipe(webp())
    .pipe(gulp.dest('dist/images/areas'))
);

gulp.task('navigationThumbsJPG', () =>
    gulp
    .src('src/images/areas/**/*.jpg')
    .pipe(
      imageResize({
        width: 24,
        height: 24,
        crop: true,
        upscale: false,
        imageMagick: true
      })
    )
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images/navigationThumbs'))
);

gulp.task('navigationThumbsWebP', () =>
    gulp
    .src('src/images/areas/**/*.jpg')
    .pipe(
      imageResize({
        width: 24,
        height: 24,
        crop: true,
        upscale: false,
        imageMagick: true
      })
    )
    //.pipe(imagemin())
    .pipe(webp())
    .pipe(gulp.dest('dist/images/navigationThumbs'))
);

// GENERATE AREA IMAGES
gulp.task('cleanAreaImages', function () {
  return del([
    'public/images/areas/low/**',
    'public/images/areas/high/**',
    '!public/images/'
  ]);
});

gulp.task('generateAreaImagesLow', function () {
  return gulp
    .src('src/images/areas/*.jpg')
    .pipe(
      imagemin([
        imageminMozjpeg({
          quality: 20
        })
        //imageminWebp({quality: 75}),
      ])
    )
    .pipe(gulp.dest('public/images/areas/low'));
});

gulp.task('generateHeaderAreaHigh', function () {
  return gulp
    .src('src/images/areas/*.jpg')
    .pipe(
      imagemin([
        imageminMozjpeg({
          quality: 100
        })
        //imageminWebp({quality: 75}),
      ])
    )
    .pipe(responsive({
      '**/*': [{
        width: 100,
        suffix: '-100'
      }, {
        width: 100 * 2,
        suffix: '-100-2x'
      }],
      '**/*': [{
        width: 600,
        crop: true,
        gravity: 'Center'
      }]
    }))
    .pipe(gulp.dest('public/images/areas/high'));
});

gulp.task(
  'generateImagesArea',
  gulp.series(
    'cleanAreaImages',
    'generateAreaImagesLow',
    'generateHeaderAreaHigh'
  )
);

gulp.task("images", () => {
  //   specify different image sizes
  const sizes = [
    { width: 48, quality: 100, suffix: "very-small" },
    { width: 320, quality: 100, suffix: "small" },
    { width: 640, quality: 80, suffix: "medium" },
    { width: 1000, quality: 80, suffix: "large" },
  ]
  let stream
  sizes.forEach(size => {
    stream = gulp
      //     source for images to optimize
      .src("src/images/**/*.jpg")
      //     resize image
      .pipe(imageResize({ width: size.width }))
      //       add suffix to image
      .pipe(
        rename(path => {
          path.basename += `-${size.suffix}`
        })
      )
      //     reduce image quality based on the size
      .pipe(
        imagemin(
          [
            imageminMozjpeg({
              quality: size.quality,
            }),
          ],
          {
            verbose: true,
          }
        )
      )
      //     output optimized images to a destination folder
      .pipe(gulp.dest("dist/images/"))
  })
  return stream
})

// GENERATE TOPO IMAGES
gulp.task("topoImagesJpg", () => {
  const sizes = [
    { width: 1000, quality: 30, suffix: "low" },
    { width: 1000, quality: 100, suffix: "high" },
  ]
  let stream
  sizes.forEach(size => {
    stream = gulp
      .src("src/images/topos/**/*.jpg")
      .pipe(imageResize({ width: size.width }))
      .pipe(
        rename(path => {
          path.basename += `-${size.suffix}`
        })
      )
      .pipe(
        imagemin(
          [
            imageminMozjpeg({
              quality: size.quality,
            })
          ],
          {
            verbose: true,
          }
        )
      )
      .pipe(gulp.dest("dist/images/topos"))
  })
  return stream
});
gulp.task("toposImagesWebp", function() {
  let src = "src/images/topos/**/*.jpg";
  let dest = "dist/images/topos";
  return gulp.src(src)
    .pipe(imagemin([
      imageminWebp({
        quality: 70
      })
    ]))
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest(dest));
});
gulp.task('cleanTopos', function () {
  return del(['dist/images/topos/low/**', 'dist/images/topos/high/**', 'dist/images/topos/**', '!dist/images/']);
});
gulp.task('generateTopos', gulp.series('cleanTopos', 'topoImagesJpg', 'toposImagesWebp'));


gulp.task('clean', function () {
  return del(['build/images/galerie/**', '!build/images/']);
});

gulp.task('galerieImages', function () {
  return gulp
    .src(['app/images/galerie/**/*'], {
      base: 'app/images/'
    })
    .pipe(
      imagemin([
        imagemin.jpegtran({
          progressive: true
        })
      ])
    )
    .pipe(
      imageResize({
        //percentage: 50
        width: 1000,
        height: 1000,
        max: true
      })
    )
    .pipe(gulp.dest('build/images'));
});

gulp.task('thumb', function () {
  return (
    gulp
    .src(
      [
        'app/images/galerie/Altmuehltal/*'
        //'app/images/galerie/Donaudurchbruch/*',
        //'app/images/galerie/Konstein/*',
        //'app/images/galerie/Schleier/*'
        //'app/images/rockImages/*'
      ], {
        base: 'app/images/'
      }
    )
    //gulp.src(imgSrc)
    .pipe(
      imageResize({
        width: 500,
        height: 400,
        crop: true,
        upscale: false,
        imageMagick: true
      })
    )
    .pipe(imagemin())
    .pipe(
      rename({
        dirname: 'thumb',
        prefix: 'Thumb'
      })
    )
    .pipe(
      gulp.dest(
        'build/images/galerie/Altmuehltal'
        //'build/images/galerie/Donaudurchbruch',
        //'build/images/galerie/Konstein',
        //'build/images/galerie/Schleier'
        //'build/images/rockImages'
      )
    )
  );
});

gulp.task(
  'optimizeImages',
  gulp.series('clean', gulp.parallel('galerieImages'), gulp.parallel('thumb'))
);