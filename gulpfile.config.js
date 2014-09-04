
var GLOBSTAR = '**/*';

var basePaths = {
    src: 'src/',
    dest: 'build/'
};

var typeMap = {
    // templates
    jade:       ['*.jade'],

    // styles
    css:        [GLOBSTAR + '.css'],
    less:       [GLOBSTAR + '.less'],

    // scripts
    js:         [GLOBSTAR + '.js', '!libs/**/*.js'],
    coffee:     [GLOBSTAR + '.coffee'],
    jslibs:     ['libs/**/*.js'],

    // images
    png:        [GLOBSTAR + '.png'],
    jpg:        [GLOBSTAR + '.jpg', GLOBSTAR + '.jpeg'],
    gif:        [GLOBSTAR + '.gif'],

    // extras
    extras:   [GLOBSTAR]
};

module.exports = {
  SERVER_PORT: 1337,
  GLOBSTAR: GLOBSTAR,
  basePaths: basePaths,


  typePaths: {
    templates: {
      src: basePaths.src + 'templates/',
      dest: basePaths.dest + ''
    },
    styles: {
      src: basePaths.src + 'styles/',
      dest: basePaths.dest + 'styles/'
    },
    scripts: {
      src: basePaths.src + 'scripts/',
      dest: basePaths.dest + 'scripts/'
    },
    images: {
      src: basePaths.src + 'images/',
      dest: basePaths.dest + 'images/'
    },
    extras: {
      src: basePaths.src + 'extras/',
      dest: basePaths.dest + ''
    }
  },

  typeMap: typeMap,

  appFiles: {
    templates:  typeMap.jade,
    styles:     typeMap.css.concat(typeMap.less),
    scripts:    typeMap.js.concat(typeMap.coffee),
    images:     typeMap.png.concat(typeMap.gif).concat(typeMap.jpg),
    extras:     typeMap.extras
  },

  vendorFiles: {
    scripts:    typeMap.jslibs
  },

  scriptOrder: [
    'config.js',
    'jquery-2.1.0.min.js',
    'jquery.countdown.min.js',
    'jquery.easing.1.3.js',
    'jquery.scrollUp.min.js',
    'jquery.touchSwipe.min.js',
    'jquery.liquid-slider-custom.min.js',
    'd3.min.js',
    'd3_tooltip.js',
    'nano.scroller.min.js',

    'topojson.v1.min.js',
    'meetupmap.js',
    'video-background.js',
    'bootstrap.min.js',
    'jquery.knob.js',
    'numeral.js',
    'underscore-min.js',
    'moment.min.js',
    'jquery.PrintArea.js',
    'pdfobject.min.js',
    'ethersale/Blob.js',
    'ethersale/FileSaver.js',
    'main.js',

    'ethersale/angular.min.js',
    'ethersale/angular-touch.min.js',
    'ethersale/jquery.qrcode.min.js',
    'ethersale/bitcoinjs-min.js',
    'ethersale/aes.js',
    'ethersale/pbkdf2.js',
    'ethersale/sha256.js',
    'ethersale/sha3.js',
    'ethersale/xethtool.js',
    'ethersale/base64.js',
    'ethersale/password-dict.js'
  ],

  styleOrder: [
    'bootstrap.min.css',
    'bootstrap-theme.min.css',
    'font-awesome.min.css',
    'liquid-slider.css',
    'animate.css',
    'roboto.css',
    'zocial.css',
    'meetupmap.css',
    'printclearly.css',
    'style.css',
    'app.min.css'
  ]
};
