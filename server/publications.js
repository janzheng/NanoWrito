
// these are all the data the server lets the client see, if autopublish is turned off
// changed 'posts' from book example to 'fetch_posts' since it gets confusing betw posts variable from front-end

// replaces autopublish if turned off ('meteor remove autopublish')
Meteor.publish('publ_AllPosts', function() {
  return Posts.find();
});

Meteor.publish('publ_AllUserPosts', function() {
  return Posts.find({userId: this.userId});
});

// // for the pagination exercise; options is the count
// // note that options is a JS obj that can be called from console
// // in this case it's ok since we're doing a find on all posts
// // but could potentially be dangerous.

// // another way to more securely do this is:
// // Meteor.publish('posts', function(sort, limit) {
// //   return Posts.find({}, {sort: sort, limit: limit});
// // });
// Meteor.publish('posts', function(options) {
//   return Posts.find({}, options);
// });
Meteor.publish('singlePost', function(id) {
  return id && Posts.find(id);
});


// // on the server
// // example of how to exclude published / local data
// Meteor.publish('fetch_posts', function() {
//   return Posts.find({flagged: false}); 
// });

// // on the server
// // add author so we can change subscription to just author
// Meteor.publish('fetch_author', function(author) {
//   return Posts.find({author: author});
// });

// // only returns author:Tom and where date is false
// Meteor.publish('allPosts', function(){
//   return Posts.find({'author':'Tom'}, {fields: {
//     date: false
//   }});
// });

// // return all comments
// // Meteor.publish('comments', function() {
// //   return Comments.find();
// // });

// // only return comments assoc. w/ post
// Meteor.publish('comments', function(postId) {
//   return Comments.find({postId: postId});
// });

// // this returns all publications for all users
// Meteor.publish('notifications', function() {
//   // return Notifications.find();
//   return Notifications.find({userId: this.userId});
// });



