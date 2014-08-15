
// dummy data for a blank db instance

// if (Posts.find().count() === 0) {
//   Posts.insert({
//     title: 'Introducing Telescope',
//     author: 'Sacha Greif',
//     url: 'http://sachagreif.com/introducing-telescope/',
//     flagged: true
//   });

//   Posts.insert({
//     title: 'Meteor',
//     author: 'Tom Coleman',
//     url: 'http://meteor.com',
//     flagged: true
//   });

//   Posts.insert({
//     title: 'The Meteor Book',
//     author: 'Tom Coleman',
//     url: 'http://themeteorbook.com',
//     flagged: false
//   });
// }


// // Fixture data 
// if (Posts.find().count() === 0) {
//   var now = new Date().getTime();

//   // create two users
//   var tomId = Meteor.users.insert({
//     profile: { name: 'Tom Coleman' }
//   });
//   var tom = Meteor.users.findOne(tomId);
//   var sachaId = Meteor.users.insert({
//     profile: { name: 'Sacha Greif' }
//   });
//   var sacha = Meteor.users.findOne(sachaId);

//   var telescopeId = Posts.insert({
//     title: 'Introducing Telescope',
//     userId: sacha._id,
//     author: sacha.profile.name,
//     commentsCount: 2,
//     upvoters: [], votes: 0,
//     url: 'http://sachagreif.com/introducing-telescope/',
//     submitted: now - 7 * 3600 * 1000
//   });

//   Comments.insert({
//     postId: telescopeId,
//     userId: tom._id,
//     author: tom.profile.name,
//     submitted: now - 5 * 3600 * 1000,
//     body: 'Interesting project Sacha, can I get involved?'
//   });

//   Comments.insert({
//     postId: telescopeId,
//     userId: sacha._id,
//     author: sacha.profile.name,
//     submitted: now - 3 * 3600 * 1000,
//     body: 'You sure can Tom!'
//   });

//   Posts.insert({
//     title: 'Meteor',
//     userId: tom._id,
//     author: tom.profile.name,
//     url: 'http://meteor.com',
//     commentsCount: 0,
//     submitted: now - 10 * 3600 * 1000,
//     upvoters: [], votes: 0
//   });

//   Posts.insert({
//     title: 'The Meteor Book',
//     userId: tom._id,
//     author: tom.profile.name,
//     url: 'http://themeteorbook.com',
//     commentsCount: 0,
//     submitted: now - 12 * 3600 * 1000,
//     upvoters: [], votes: 0
//   });

//   for (var i = 0; i < 10; i++) {
//     Posts.insert({
//       title: 'Test post #' + i,
//       author: sacha.profile.name,
//       userId: sacha._id,
//       url: 'http://google.com/?q=test-' + i,
//       submitted: now - i * 3600 * 1000,
//       commentsCount: 0,
//       upvoters: [], votes: 0
//     });
//   }
// }


