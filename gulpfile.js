"use strict";

// /////////////////////////////////////////
// Required
// /////////////////////////////////////////
let gulp = require("gulp"),
  del = require("del"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  imageResize = require("gulp-image-resize"),
  imagemin = require("gulp-imagemin"),
  responsive = require("gulp-responsive-images"),
  imageminJpegRecompress = require("imagemin-jpeg-recompress"),
  imageminMozjpeg = require("imagemin-mozjpeg"),
  imageminWebp = require("imagemin-webp"),
  extReplace = require("gulp-ext-replace"),
  webp = require("gulp-webp");
// /////////////////////////////////////////
// IMAGES Task
// /////////////////////////////////////////
gulp.task("areaImagesWebp", () =>
  gulp
    .src("src/images/areas/**/*.jpg")
    .pipe(imageResize({ width: 400 }))
    .pipe(webp())
    .pipe(gulp.dest("dist/images/areas"))
);
gulp.task("navigationThumbsJPG", () =>
  gulp
    .src("src/images/areas/**/*.jpg")
    .pipe(
      imageResize({
        width: 24,
        height: 24,
        crop: true,
        upscale: false,
        imageMagick: true,
      })
    )
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images/navigationThumbs"))
);
gulp.task("navigationThumbsWebP", () =>
  gulp
    .src("src/images/areas/**/*.jpg")
    .pipe(
      imageResize({
        width: 24,
        height: 24,
        crop: true,
        upscale: false,
        imageMagick: true,
      })
    )
    .pipe(webp())
    .pipe(gulp.dest("dist/images/navigationThumbs"))
);

gulp.task("galerieImagesNew", () =>
  gulp
    .src(["src/images/galerie/**/*.jpg", "src/images/galerie/**/*.JPG"])
    .pipe(
      imageResize({
        width: 1000,
        height: 563,
        crop: true,
        upscale: false,
        imageMagick: true,
      })
    )
    .pipe(webp())
    .pipe(gulp.dest("dist/images/galerie-new"))
);
gulp.task("convertImages", () => {
  const sizes = [
    { width: 200, quality: 100, suffix: "low" },
    { width: 1000, quality: 100, suffix: "high" },
  ];
  let stream;
  sizes.forEach((size) => {
    stream = gulp
      .src("src/images/**/*.jpg")
      .pipe(imageResize({ width: size.width }))
      .pipe(
        rename((path) => {
          path.basename += `-${size.suffix}`;
        })
      )
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
      .pipe(gulp.dest("dist/images"));
  });
  return stream;
});
gulp.task("imagesWebp", function () {
  let src = "src/images/**/*.jpg";
  let dest = "dist/images";
  return gulp
    .src(src)
    .pipe(
      imagemin([
        imageminWebp({
          quality: 70,
        }),
      ])
    )
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest(dest));
});
gulp.task("delImages", function () {
  return del(["dist/images/**/*", "!dist/images/"]);
});
gulp.task(
  "generateImages",
  gulp.series(
    "delImages",
    "convertImages",
    "imagesWebp",
    "navigationThumbsJPG",
    "navigationThumbsWebP",
    "areaImagesWebp",
    "galerieImagesNew"
  )
);

// Generate Images for Maps
gulp.task("delImagesMaps", function () {
  return del(["dist/images/rocksmap/**/*", "!dist/images/"]);
});

gulp.task("rocksForMap", () =>
  gulp
    .src("src/images/rocksmap/**/*.jpg")
    .pipe(
      imageResize({
        width: 150,
        height: 150,
        crop: true,
        upscale: false,
        imageMagick: true,
      })
    )
    .pipe(webp())
    .pipe(gulp.dest("dist/images/rocksmap"))
);

gulp.task("generateImagesForMaps", gulp.series("delImagesMaps", "rocksForMap"));

gulp.task("imagesTopos", function () {
  let src = "src/images/topos/schwedenfels.jpg";
  let dest = "dist/images/test";
  return gulp
    .src(src)
    .pipe(
      imagemin([
        imageminWebp({
          quality: 10,
        }),
      ])
    )
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest(dest));
});
