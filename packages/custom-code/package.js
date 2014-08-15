Package.describe({
    summary: "Local custom code for scss. In a package to avoid loading hassles"
});

Package.on_use(function (api) {
   api.use(["scss"], ['client']);
    //dont need to add any files to the client, they're there just so the package will build
});
