
Template.postContent.helpers({
  json: function() {
    // Meteor.call("checkTwitter", function(error, results) {
    //   console.log('whassup');
    //   console.log(results); //results.data should be a JSON object
    // });

    var term = "test";
    Meteor.call('checkTwitter', "janistanitrade", function(err, result){
      if(!err){
        if (result.statusCode === 200) // This checks if we got a good response
          console.log(result.data); // This is the actual data
      }
    });
  }
  // domain: function() {
  //   var a = document.createElement('a');
  //   a.href = this.url;
  //   return a.hostname;
  // },
  // ownPost: function() {
  //   return this.userId == Meteor.userId();
  // },

  // special class used for post_item for post classes and animation
  // attributes: function() {
  //   var post = _.extend({}, Positions.findOne({postId: this._id}), this);
  //   var newPosition = post._rank * POST_HEIGHT;
  //   var attributes = {};
  //   if (! _.isUndefined(post.position)) {
  //     var offset = post.position - newPosition;      
  //     attributes.style = "top: " + offset + "px";
  //     if (offset === 0)
  //       attributes.class = "post animate"
  //   } else {
  //     attributes.class = 'post invisible';
  //   }
  //   Meteor.setTimeout(function() {
  //     Positions.upsert({postId: post._id}, {$set: {position: newPosition}})
  //   });
  //   return attributes;
  // }
  // normalized and moved to the collection as an incrementer
  // commentsCount: function() {
  //   return Comments.find({postId: this._id}).count();
  // }
});
