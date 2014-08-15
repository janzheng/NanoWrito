
Meteor.startup(function() {
  // Deps.autorun(function() {
  //   console.log('There are ' + Posts.find().count() + ' posts');
  // });

  console.log("Meteor Starting Up...");
  Accounts.loginServiceConfiguration.remove({
    service : 'twitter'
  });

  Accounts.loginServiceConfiguration.insert({
    service     : 'twitter',
    consumerKey : 'TW7yQEuJidwNyYBouv9zGwECF',
    secret      : 'IKauXmyUQjxXJcmBQgHVcJ912sjm0wy0HJiBJt9pdsSnmLx42N'
  });


  // skip Facebook for now
  // Accounts.loginServiceConfiguration.remove({
  //   service: "facebook"
  // });
  // Accounts.loginServiceConfiguration.insert({
  //   service: "facebook",
  //   appId: "286227308231460",
  //   secret: "4ea1b173aae2d3913b2145a669baeb81"
  // });


  // Account Profile values:
  // user.profile {
  //   name: generated from twitter
  //   textsize: small, medium, large - denotes text size to use for novel
  //   counter: on (both), off (none), write (not in zen mode)
  // }
  Accounts.onCreateUser(function (options, user) {

    // We still want the default hook's 'profile' behavior.
    if (options.profile)
      user.profile = options.profile;

    // keep the twitter nickname; use a new field called nickname for user name displays
    user.profile.nickname = user.profile.name;
    user.profile.textsize = "medium";
    user.profile.counter = "on";


    return user;
  });
});

