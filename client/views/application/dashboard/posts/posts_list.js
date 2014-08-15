
// Template.postsList.helpers({
//   posts: function() {
//     return Posts.find();
//   }
// });

// on the client
// finding / filtering from the local database
// Template.postsList.helpers({
//     posts: function(){
//         return Posts.find({author: 'bob-smith', category: 'JavaScript'});
//     }
// });
Meteor.subscribe('publ_AllUserPosts');

// don't need this helper since we've added this data on the route level
// Template.postsList.helpers({
//   posts: function() {
//     return Posts.find();
//   },
//   noPostsFound: function () {
//     return Posts.find().count() == 0;
//   }
// });


// add ranking
Template.postsList.helpers({
  postsWithRank: function() {
    this.posts.rewind();
    return this.posts.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
  }
});