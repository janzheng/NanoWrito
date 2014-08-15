
// submitting right into Posts collection
// Template.postSubmit.events({
//   'submit form': function(e) {
//     e.preventDefault();

//     var post = {
//       url: $(e.target).find('[name=url]').val(),
//       title: $(e.target).find('[name=title]').val(),
//       message: $(e.target).find('[name=message]').val()
//     }

//     post._id = Posts.insert(post);
//     Router.go('postPage', post);
//   }
// });

// submitting into Posts using a reusable function. Changed the method to be called 'postMethod' bc everything is called post
Template.postSubmit.events({
  'click .post__create': function(e) {
    e.preventDefault();

    var post = {
      title: $('[name=title]').val(),
      content: $('[name=content]').val()
    }

    //in the posts collection
    Meteor.call('newPost', post, function(error, id) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
        // if (error.error === 302)
          // Router.go('postPage', {_id: error.details})

        //exit out of method call if general error
        return false;

      } else {
        // Router.go('postPage', {_id: id});
      }

      // wait for postmethod to finish successfully
      // Router.go('postPage', {_id: id});
    });

  }
});


Template.postSubmit.rendered = function() {
  $('.content-editor').wysihtml5({
    "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
    "emphasis": true, //Italics, bold, etc. Default true
    "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
    "html": true, //Button which allows you to edit the generated HTML. Default false
    "link": true, //Button to insert a link. Default true
    "image": true, //Button to insert an image. Default true,
    "color": true, //Button to change color of font
    "size": 'sm' //Button size like sm, xs etc.
  });

  $('.title-editor').wysihtml5({
    "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
    "emphasis": false, //Italics, bold, etc. Default true
    "lists": false, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
    "html": false, //Button which allows you to edit the generated HTML. Default false
    "link": false, //Button to insert a link. Default true
    "image": false, //Button to insert an image. Default true,
    "color": false, //Button to change color of font
    "size": 'sm' //Button size like sm, xs etc.
  });

}

