
console.log("Welcome to Nanowrito!");


Meteor.autorun(function() {
    Session.set("userLoggedIn",!!Meteor.user());
});

Handlebars.registerHelper('userLoggedIn',function(input){
    return Session.get('userLoggedIn');
});


Deps.autorun(function() {
  console.log('User login state: ' + Session.get('userLoggedIn'));
})
