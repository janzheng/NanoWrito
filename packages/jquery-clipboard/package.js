Package.describe({
  summary: "jQuery Clipboard plugin packaged for meteor"
});

Package.on_use(function (api){
  api.use([
      'deps',
      'jquery',
  ], 'client');
  api.add_files('jquery.clipboard.js', 'client');
  api.add_files('jquery.clipboard.swf', 'client');
});
