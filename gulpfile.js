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
  imageminWebp = require('imagemin-webp')
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
gulp.task('cleanHeaderImages', function () {
  return del([
    'public/images/headerImages/low/**',
    'public/images/headerImages/high/**',
    '!public/images/'
  ]);
});

gulp.task('generateHeaderImagesLow', function () {
  return gulp
    .src('src/images/headerImages/*.jpg')
    .pipe(
      imagemin([
        imageminMozjpeg({
          quality: 50
        })
        //imageminWebp({quality: 75}),
      ])
    )
    .pipe(gulp.dest('public/images/headerImages/low'));
});

gulp.task('generateHeaderImagesHigh', function () {
  return gulp
    .src('src/images/headerImages/*.jpg')
    .pipe(
      imagemin([
        imageminMozjpeg({
          quality: 100
        })
        //imageminWebp({quality: 75}),
      ])
    )
    .pipe(gulp.dest('public/images/headerImages/high'));
});

gulp.task(
  'generateImagesHeader',
  gulp.series(
    'cleanHeaderImages',
    'generateHeaderImagesLow',
    'generateHeaderImagesHigh'
  )
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
gulp.task('cleanTopos', function () {
  return del(['public/images/topos/low/**', 'public/images/topos/high/**', '!public/images/']);
});
gulp.task('generateTopoLow', function () {
  return gulp
    .src('src/images/topos/*.jpg')
    .pipe(
      imagemin([
        imageminMozjpeg({
          quality: 30
        })
      ])
    )
    .pipe(gulp.dest('public/images/topos/low'));
});

gulp.task('generateTopoHigh', function () {
  return gulp
    .src('src/images/topos/*.jpg')
    .pipe(
      imagemin([
        imageminMozjpeg({
          quality: 100
        })
      ])
    )
    .pipe(gulp.dest('public/images/topos/high'));
});

gulp.task(
  'generateTopos',
  gulp.series(
    'cleanTopos',
    'generateTopoLow',
    'generateTopoHigh'
  )
);

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