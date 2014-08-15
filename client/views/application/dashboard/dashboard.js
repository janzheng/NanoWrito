
// The Dashboard is the template for the main Application

Meteor.subscribe('publ_AllUserPosts');


// don't need this helper since we've added this data on the route level
Template.dashboard.helpers({
  noPostsFound: function() {
    return Posts.find().count() == 0;
  },
  newPostSelect: function() {
    if (Session.get('postTypes').length > 0)
      return true;
    return false;
  }
});


// check if the user has written anything in the logged-out state
Template.dashboard.rendered = function() {

   // create a new novel (functions modified from writeApp)
   var paragraphs = Session.get('contentToNew');

   if(typeof paragraphs != 'undefined') {
      if (paragraphs.length > 0) {
         var obj = {
            sessions: {
               paragraphs: paragraphs,
               sessionDate: moment()
            }
         }
         novelCreate(obj);
         Session.set('contentToNew','');
      }
    }

}


function novelCreate(obj) {

   //check for user
   if (!Session.get('userLoggedIn')) { return null; }

   Meteor.call('newPost', obj, function(error, id) {
      // console.log('Dashboard-created novel id: ' + id);
   });
}
