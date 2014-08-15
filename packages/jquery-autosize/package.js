Package.describe({
  summary: "jQuery Autosize plugin packaged for meteor"
});

Package.on_use(function (api){
  api.use([
      'jquery',
  ], 'client');
  api.add_files('jquery.autosize.min.js', 'client');
});
