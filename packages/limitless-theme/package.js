Package.describe({
  name: 'limitless-theme',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.3.2');
  api.use('ecmascript');
  // api.mainModule('limitless-theme.js');
  api.addFiles([
    'fonts/icomoon.ttf',
    'fonts/icomoon.woff',
    'fonts/icomoon.eot',
    'fonts/icomoon.svg',
  ], 'client', {
      isAsset: true
  });

    api.addFiles("css/bootstrap.css", 'client');
    api.addFiles("css/styles.css", 'client');

    api.addFiles("css/core.css", 'client');
    api.addFiles("css/components.css", 'client');
    api.addFiles("css/colors.css", 'client');

    api.addFiles("js/switchery.min.js", 'client');
    api.addFiles("js/uniform.min.js", 'client');

    api.addFiles("js/pace.min.js", 'client');
    api.addFiles("js/blockui.min.js", 'client');
    api.addFiles("js/jquery.min.js", 'client');
    api.addFiles("js/bootstrap.min.js", 'client');
    api.addFiles("js/select2.min.js", 'client');
    api.addFiles("js/ion_rangeslider.min.js", 'client');
    // api.addFiles("js/layout_fixed_custom.js", 'client');

    // api.addFiles("js/app.js", 'client');

});

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('limitless-theme');
//   api.mainModule('limitless-theme-tests.js');
// });
