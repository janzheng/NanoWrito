

// twitter check api call
if (Meteor.isServer) {
    // var twitter = new TwitterApi();
}

Meteor.methods({
  searchTwitter: function(term) {
      return twitter.search(term);
  },
  checkTwitter: function(username) {
    return twitter.get(
      "statuses/user_timeline.json",
      {
        screen_name: username
      }
    );
  }
});
