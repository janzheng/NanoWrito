Package.describe({
    summary: "Uses swfobject and ZeroClipboard to allow users to copy text to the clipboard"
});

Package.on_use(function (api) {
    api.use('jquery', ['client', 'server']);
    //dont need to add any files to the client, they're there just so the package will build
});
