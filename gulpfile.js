"use strict";

// /////////////////////////////////////////
// Required
// /////////////////////////////////////////
let gulp = require("gulp"),
  del = require("del"),
  rename = require("gulp-rename"),
  imageResize = require("gulp-image-resize"),
  imagemin = require("gulp-imagemin"),
  imageminWebp = require("imagemin-webp"),
  webp = require("gulp-webp");
// /////////////////////////////////////////
// IMAGES Task
// /////////////////////////////////////////

// Topo Images
// Ursprungsbild 1024 * 820
// Desktop Version schon 742 * 600
// Tablet verhält sich fast so wie Desktop
// Mobile Portrait Mode max 400 px Landscape Mode ist fast wie Desktop

gulp.task("topos", () => {
  const sizes = [
    { width: 750, quality: 5, suffix: "-low" },
    { width: 750, quality: 100, suffix: "-high" },
    { width: 1024, quality: 100, suffix: "@2x" },
    { width: 750, quality: 100, suffix: "" },
  ];
  let stream;
  sizes.forEach((size) => {
    stream = gulp
      .src("src/images/topos/**/*.jpg")
      .pipe(imageResize({ width: size.width }))
      .pipe(
        rename((path) => {
          path.basename += `${size.suffix}`;
        })
      )
      .pipe(
        imagemin([
          imageminWebp({
            quality: size.quality,
          }),
        ])
      )
      .pipe(webp())
      .pipe(gulp.dest("dist/images/topos"));
  });
  return stream;
});

gulp.task("areas", () => {
  const sizes = [
    { width: 400, quality: 100, suffix: "" },
    { width: 800, quality: 100, suffix: "@2x" },
    { width: 1200, quality: 80, suffix: "@3x" },
  ];
  let stream;
  sizes.forEach((size) => {
    stream = gulp
      .src("src/images/areas/**/*.jpg")
      .pipe(imageResize({ width: size.width }))
      .pipe(
        rename((path) => {
          path.basename += `${size.suffix}`;
        })
      )
      .pipe(
        imagemin([
          imageminWebp({
            quality: size.quality,
          }),
        ])
      )
      .pipe(webp())
      .pipe(gulp.dest("dist/images/areas"));
  });
  return stream;
});

gulp.task("navigation", () => {
  // del("../munichclimbs.de/public/uploads/navigation/**/*");
  const sizes = [
    { width: 24, height: 24, quality: 100, suffix: "" },
    { width: 48, height: 48, quality: 100, suffix: "@2x" },
    { width: 72, height: 72, quality: 100, suffix: "@3x" },
  ];
  let stream;
  sizes.forEach((size) => {
    stream = gulp
      .src("src/images/areas/**/*.jpg")
      .pipe(
        imageResize({
          width: size.width,
          height: size.height,
          crop: true,
          upscale: false,
          imageMagick: true,
        })
      )
      .pipe(
        rename((path) => {
          path.basename += `${size.suffix}`;
        })
      )
      .pipe(
        imagemin([
          imageminWebp({
            quality: size.quality,
          }),
        ])
      )
      .pipe(webp())
      .pipe(gulp.dest("../munichclimbs.de/public/uploads/navigation"));
  });
  return stream;
});

gulp.task("galerie", () => {
  const sizes = [
    { width: 100, quality: 80, suffix: "_thumb" },
    { width: 1000, quality: 100, suffix: "" },
    { width: 2000, quality: 100, suffix: "@2x" },
    { width: 2000, quality: 80, suffix: "@3x" },
  ];
  let stream;
  sizes.forEach((size) => {
    stream = gulp
      .src("src/images/galerie/**/*.jpg")
      .pipe(imageResize({ width: size.width }))
      .pipe(
        rename((path) => {
          path.basename += `${size.suffix}`;
        })
      )
      .pipe(
        imagemin([
          imageminWebp({
            quality: size.quality,
          }),
        ])
      )
      .pipe(webp())
      .pipe(gulp.dest("../munichclimbs.de/public/uploads/galerie"));
  });
  return stream;
});

gulp.task("header", () => {
  const sizes = [
    { width: 1320, quality: 10, suffix: "-large-low-@1x" },
    { width: 1320, quality: 100, suffix: "-large-@1x" },
    { width: 2640, quality: 100, suffix: "-large-@2x" },
    { width: 3960, quality: 100, suffix: "-large-@3x" },
    { width: 800, quality: 10, suffix: "-medium-low-@1x" },
    { width: 800, quality: 100, suffix: "-medium-@1x" },
    { width: 1600, quality: 100, suffix: "-medium-@2x" },
    { width: 2400, quality: 100, suffix: "-medium-@3x" },
    { width: 480, quality: 10, suffix: "-small-low-@1x" },
    { width: 480, quality: 100, suffix: "-small-@1x" },
    { width: 960, quality: 100, suffix: "-small-@2x" },
    { width: 1440, quality: 100, suffix: "-small-@3x" },
  ];
  del("dist/images/header/**/*");
  let src = "src/images/header/*.jpg";
  let dest = "dist/images/header";
  let stream;
  sizes.forEach((size) => {
    stream = gulp
      .src(src)
      .pipe(imageResize({ width: size.width }))
      .pipe(
        rename((path) => {
          path.basename += `${size.suffix}`;
        })
      )
      .pipe(
        imagemin([
          imageminWebp({
            quality: size.quality,
          }),
        ])
      )
      .pipe(webp())
      .pipe(gulp.dest(dest));
  });
  return stream;
});

const sizes = [
  { quality: 10, suffix: "low" },
  { quality: 80, suffix: "high" },
];

gulp.task("areaHeaderImages", () => {
  del("dist/images/areaHeaderImages/**/*");
  let src = "src/images/areaHeaderImages/*.jpg";
  let dest = "dist/images/areaHeaderImages";
  let stream;
  sizes.forEach((size) => {
    stream = gulp
      .src(src)
      .pipe(
        imagemin([
          imageminWebp({
            quality: size.quality,
          }),
        ])
      )
      .pipe(
        rename((path) => {
          path.basename += `-${size.suffix}`; // append suffix to filename
          path.extname = ".webp"; // change extension to .webp
        })
      )
      .pipe(gulp.dest(dest));
  });
  return stream;
});

gulp.task(
  "rocksmap",
  () => del("dist/images/rocksmap/**/*"),
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

gulp.task("delImages", function () {
  return del(["dist/images/**/*", "!dist/images/"]);
});

gulp.task(
  "generateImages",
  gulp.series(
    "delImages",
    "topos",
    "areas",
    "navigation",
    "galerie",
    "areaHeaderImages",
    "rocksmap"
  )
);
