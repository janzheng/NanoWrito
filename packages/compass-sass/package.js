Package.describe({
    summary: "Compass for SASS"
});

Package.on_use(function (api) {
    api.use('scss', ['client', 'server']);
    //dont need to add any files to the client, they're there just so the package will build
});
