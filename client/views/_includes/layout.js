
// pageTitle is set as a session var, and can be set using: Session.set('pageTitle', 'A brand new title'); -->

// auto listener: Deps.autorun - launches the code onChange
// Deps.autorun( function() { console.log('Value is: ' + Session.get('pageTitle')); } );
// session variable useful for storing temp content (duh)
Template.layout.helpers({
   zenClass: function() {
      return Session.get('zenMode');
   },
});
