
// iron-router controls what content gets displayed / redirected



Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

// extend post list counter to a route controller
PostsListController = RouteController.extend({
  template: 'novelList',
  limit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    // return {sort: {submitted: -1}, limit: this.limit()};
    return {sort: this.sort, limit: this.limit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    return Meteor.subscribe('pub_Posts');
    // return {posts: Posts.find({}, this.findOptions())}; //just return a list of posts
    // var hasMore = this.posts().count() === this.limit();
    // var nextPath = this.route.path({postsLimit: this.limit() + this.increment});
    // return {
    //   posts: this.posts(),
    //   nextPath: hasMore ? this.nextPath() : null
    // };
  }
});

// extend postlist controller to add sorting of votes
NewPostsListController = PostsListController.extend({
//   sort: {votes: -1, submitted: -1, _id: -1},
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.limit() + this.increment})
  }
});


// Order:
// - main
// - - layout
// - - ? if user:
// - - - application
// - - - - {{>yield}}
// - - ? if not user:
// - - - splash

Router.map(function() {

  // route to dashboard for logged in users
  // first pointer of {{> yield}}
  // this.route('dashboard', {
  //   path: '/'
  // });


  // 
  // Legal / Disclaimer / Privacy page
  //
  this.route('dashboard', {
    path: '/',
    // controller: NewPostsListController
    // controller: PostsListController
    template: 'dashboard',
    waitOn: function() {
      return [
        Meteor.subscribe('publ_AllUserPosts')
      ];
    },
    data: function() {
      return {
        posts: Posts.find({},{sort: {createdDate: -1}}),
        postItem: Posts.findOne({},{sort: {createdDate: -1, limit: 1}}),
        activeId: 0 //used by post list item to highlight the selected item for highlight
      };
    }
  });


  // post information shows up on the edit / main pain
  this.route('postSelected', {
    path: '/novels/:_id',
    // realized using _id is safest in case users want to add symbols. might cause headaches
    // this returns comments under the posts path; only loads these in when we're at that post
    // waitOn: function() {
    //   return Meteor.subscribe('comments', this.params._id);
    // },
    template: 'dashboard',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id)
      ];
    },
    data: function() { 
      // Session.set('wobble', this.params.name)
      return { 
        posts: Posts.find({},{sort: {createdDate: -1}}),
        postItem: Posts.findOne(this.params._id),
        activeId: this.params._id //used by post list item
      }; 
    }
  });


  //
  // WriteApp Routes
  //

  // when users click "new novel" / for new novels
  // (don't pass the id in)
  // this route just sends users straight to write app
  this.route('postWrite', {
    path: '/write'
  });

  // continue a novel by creating a new session
  this.route('postContinue', {
    path: '/edit/:_id',
    template: 'postWrite',
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return {_id: this.params._id, _post: Posts.findOne(this.params._id)} }
  });

  // intermediate page for creating a new novel
  // used for selecting what kind of novel
  // all the novel options are preset here;
  // later on we can use different routes for diff. users
  this.route('postNew', {
    path: '/new',
    template: 'postWrite',
    data: function() { 
      return { 
        newPostTypes: ["nanowrimo", "monthly", "weekly","free"]
      }; 
    }
  });



  // similar to postEdit, but we're specifically editing a session
  // need to use a text editor for this, not the standard writeapp
  this.route('postEditSession', {
    path: '/edit/:_id/:_sessionId',
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { 
      console.log('posteditsession:')
      console.log(Posts.findOne(this.params._id))
      console.log(Posts.find({sessions: {$elemMatch: {sessionId:this.params._sessionId}}}).fetch())

      var o = Posts.findOne(this.params._id)

      return {
        _id: this.params._id, 
        postItem: Posts.findOne(this.params._id),
        sessionId: this.params._sessionId
      } 
    }
  });



});



// login hook for user check
var requireLogin = function(pause) {
  console.log('checking requireLogin');
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    pause();
  }
}

// force auth just in case
Router.onBeforeAction('loading');
// Router.onBeforeAction(requireLogin, {only: 'postWrite'}); //this screws up the login state code
Router.onBeforeAction(function() { Errors.clearSeen(); });


