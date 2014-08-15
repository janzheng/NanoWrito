

Template.postListItem.helpers({
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  ownPost: function() {
    return this.userId == Meteor.userId();
  },

  date: function() {
    var time = this.createdDate;
    return moment(time).format('MM/D/YY, h:mm:ss a');
  },

  activeClass: function() {

    var activeId = Session.get('activeId');
    // Session.get('selectedPost', this._id);
    // console.log('post list id: ' + this._id)
    // console.log(this.params)
    var currentRoute = Router.current();
      // return currentRoute &&
      //   template === currentRoute.lookupTemplate() ? 'active' : '';

    if (activeId == this._id)
      return "active";

    if (activeId == 0) {
      var latest = Posts.findOne({},{sort: {createdDate: -1, limit: 1}});

      if (this._id == latest._id) 
        return "active";
    }
  }
});

Template.postListItem.events({
  'click .post__delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('/');
    }
  }
});



// Template.postItem.events({  
//     'click .upvotable': function(e) {
//     e.preventDefault();
//     Meteor.call('upvote', this._id);
//   }
// });

