
// Posts
// stores user novels. Lazy so haven't changed the name.
// 
// Data Model
// 
// * Dates are all tracked using Moment objects now
//
// - title
// - createdDate
// - lastModified
// - tags: ["text","text",...] (tentative)
// - *userId: Meteor.user()._id
//    - used to connect author name / back to the author
// - sessions
//    - Meteor-generated session objectId converted to string. ...*should* be unique, but might not be :P
//        - search: Posts.find({sessions: {$elemMatch: {sessionId:"f7041c2c50ab41208c0058b5"}}}).fetch()
//    - parapraphs: ["text","text",...] (each is a paragraph - eventually can track time per paragraph)
//    - sessionDate: new Date().getTime()
//    - options:
//      - draft: t/f - if true, then won't count towards word count
// - chapters (not added for now)
//    - chapter [#,#,#,...] (entry id)
// - options
//    - publish: is this published? Every time user clicks to publish, refreshes the publish
//    - url: generated URL for publish
//    - live: can this novel be broadcast live? / published as soon as a change is made
//    - startDate: when was this started?
//    - lastDate: when can users edit the essay? also used for some calculations
//    - novelType
//      - various novel types for settings and display purposes
//      - nanowrimo: 30 day challenge november to december
//      - monthly: 30 day challenge, not only in november
//      - weekly: 7 day, 15k challenge
//    - isNanoWinner (set after)

Posts = new Meteor.Collection('posts');

// permissions

Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
});

// Posts.deny({
  // update: function(userId, post, fieldNames) {
  //   // may only edit the following two fields:
  //   return (_.without(fieldNames, 'title', 'content').length > 0);
  // }
// });


// because there is no beforeUpdate function trigger, 
// and all posts.deny functions are always checked on a collection update,
// we can use deny to do other sorts of stuff for us that isn't just for
// 'deny' purposes. total hack though
// Posts.deny({
//   update: function(userId, doc, fields, modifier) {
//     doc.lastModified = +(new Date());
//     return false;
//   },
//   transform: null
// });

// Posts.allow({
//   insert: function(userId, doc) {
//     // only allow posting if you are logged in
//     return !! userId;
//   }
// });


// used by post_submit.js
// creaes a new server-side meteor method, regardless of where this function is
Meteor.methods({

  newPost: function(obj) {
    // console.log('Inserting new post / new post for user: ' + Meteor.user());
    var user = Meteor.user();

    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");

    console.log('creating new post... obj: ')

    var post = {
      title: 'New Novel',
      sessions: [],
      createdDate: moment().toJSON(), //new Date().getTime(),
      lastModified: moment().toJSON(), //new Date().getTime(),
      isNano: false,
      tags: [],
      isNanoWinner: false,
      userId: user._id,
      options: {
        novelType: obj.novelType,
      }
    };



    if(obj.novelType == 'nanowrimo') {
      post.options.startDate = moment(new Date(moment().get('year'), 11, 1, 0, 0, 0, 0)).toJSON();
      post.options.endDate = moment(new Date(moment().get('year'), 12, 1, 0, 0, 0, 0)).toJSON();
    } else if(obj.novelType == 'monthly') {
      post.options.startDate = moment().toJSON();
      post.options.endDate = moment().add('days', 30).toJSON();

    } else if(obj.novelType == 'weekly') {
      post.options.startDate = moment().toJSON();
      post.options.endDate = moment().add('days', 7).toJSON();
    } 




    console.log('post obj: ')
    console.log(post)

    if ((typeof obj.sessions) != 'undefined') {
      console.log('adding in obj into the mess')
      console.log(obj)
      post.sessions.push(obj.sessions);
    }
    
    /*
    var post =  {
      title: 'New Novel',
      sessions: [],
      createdDate: new Date().getTime(),
      lastModified: new Date().getTime(),
      isNano: false,
      tags: [],
      isNanoWinner: false,
      userId: user._id
    };
    */

    var postId = Posts.insert(post);
    return postId;
  },

  // this pushes new sessions and paragraphs into a novel
  updatePost: function(obj) {
    var user = Meteor.user();
    if (!user) throw new Meteor.Error(401, "You need to login to post new stories");

    // code from: http://stackoverflow.com/questions/16003258/update-multi-nested-array-in-mongodb
    // create a new session if the sessiondate doesn't exist
    if ( typeof Posts.findOne({_id: obj.postId, 'sessions.sessionDate': {$nin: [obj.sessionDate]}}) != "undefined" ) {

      Posts.update (
        { _id: obj.postId, 'sessions.sessionDate': {$nin: [obj.sessionDate]} }, 
        {$push: {'sessions': {sessionDate:obj.sessionDate, sessionId: new Meteor.Collection.ObjectID()._str}}},
        { upsert: true }
      )
    }

    // add the new paragraph (one pushed through at a time)
    // note that paragraphs are saved when users press enter.
    // this prevents the db from getting altered if users change the session
    Posts.update(
      { _id: obj.postId, 'sessions.sessionDate': obj.sessionDate },
      { 
        $push: {'sessions.$.paragraphs': obj.paragraph },
        $set: {'lastModified': moment() }
      }
    )

    // {
    //     _id: 1
    //     tags: [{
    //         tag: 'foo'
    //         links: [{
    //             link: 'http:www.google.com'
    //             date: '123'
    //         }] 
    //     }]
    // }
    // create the userlinks collection if it doesn't exist
    // also add a tag 'foo' into it, but only if the tag doesn't exist
    // db.userlinks.update (
    //     {_id: '1', 'tags.tag': {$nin: ['foo']}}, 
    //     {$push: {'tags': {tag:'foo', links:[]}}},
    //     {upsert: true}
    // )

    // // add a link into the 'foo' tag, but only if the link doesn't exist
    // db.userlinks.update(
    //     {_id: '1', 'tags.tag': 'foo', 'tags.links.link': {$nin: ['http://foobar.com']}},
    //     {$push: {'tags.$.links': {link: 'http://foobar.com', date: '15'} } }
    // )

  },

  updateTitle: function(obj) {
    var user = Meteor.user();
    var postId = obj._id;
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");

    // ensure the post has a title
    if (!obj.title)
      throw new Meteor.Error(422, 'Please fill in a headline');

    Posts.update(postId, {$set: {'title': obj.title}  });

    return postId;
  },

  // this actually edits an existing session; will only be called on existing sessions
  // !!! Editing a session will collapse all the paragraphs into one single paragraph
  updateSession: function(postId, session, paragraph) {

    console.log('update session obj: ' + postId)
    console.log(session);
    console.log(paragraph);
    console.log(Posts.findOne(postId));


    // Rulesets.update({_id: id}, {$pull : {rules : rule}});

    // Posts.update(postId, 
    //   {$set: {'title': obj.title}  });



    Posts.update (
      { _id: postId, 'sessions': session }, 
      // {$push: {'sessions': session}}
      {$set: {'sessions.$.paragraphs': {paragraph: paragraph}}}
        // $push: {'sessions.$.paragraphs': obj.paragraph },
    )


    console.log('after: ' + postId)
    console.log(Posts.findOne(postId));
  },

  // removes a session from a post
  deleteSession: function(postId, session) {
    Posts.update (
      { _id: postId }, 
      {$pull: {'sessions': session}}
    )
  }
});



