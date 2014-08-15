

// tracks if content has changed, to activate save btn states
Session.set('contentChanged', false);
Session.set('curCount', 0 );



var sessionCounter = 0;
var post, sessionId, postId;


Template.postEditSession.created = function() {
  post = this.data.postItem;
  sessionId = this.data.sessionId;
  postId = this.data.postId;

  Session.set('curCount', 0 );
  Session.set('contentChanged', false);
}
Template.postEditSession.destroyed = function() {
  Session.set('contentChanged', false);
}


// used for setting selected / active class on post list
Template.postEditSession.rendered = function() {

  // check for Flash (for copy to clipboard)
  Session.set('hasFlash', (swfobject.hasFlashPlayerVersion('1') && true));

  Session.set('curCount', count($('.postEditSession--editable').text()) );

  // initialize clipboard copy
  initClipboard();

}


Template.postEditSession.helpers({
  getParagraphs: function() {

    // get the right session
    var session = _.findWhere(post.sessions, {sessionId: sessionId});
    var output = "";
    $.each(session.paragraphs, function( index, value ) {
      if(typeof value != 'undefined') {
        output += value;
      }
    });
    return output;
  },
  title: function() {
    return post.title;
  },
  wordCount: function() {
    // console.log('wordcount: ' + )
    return addCommas(Session.get('curCount'));
  },
  contentChanged: function() {
    return Session.get('contentChanged');
  }
});


Template.postEditSession.events({
  'keyup .postEditSession--editable': function(e) { 
    console.log('stuff changed: ')
    Session.set('contentChanged', true);
    Session.set('curCount', count($('.postEditSession--editable').text()) );

   },

  'click .post__save': function(e) {

    var postId = this._id;
    var post = {
      title: $('[name=title]').val(),
      content: $('[name=content]').val(),
      _id: postId
    }

    console.log('updating postEdit title obj ' + post.title);

    //in the posts collection
    Meteor.call('updateTitle', post, function(error, id) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
          // if (error.error === 302)
          // Router.go('postPage', {_id: error.details})
          //exit out of method call if general error
        return false;
      } else {
        // Router.go('postPage', {_id: postId});
        console.log('update title complete...');
      }
    });

  }

});


// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function count(string) {
  return((string.match(/\S+/g)||[]).length);
}


function initClipboard() {

   var copy_sel = $('.post-nav-copy');
   copy_sel.on('click', function(e) {
      e.preventDefault();
    });

   // Apply clipboard click event
   // Copy directly from session, not from the html
   copy_sel.clipboard({
      path: 'packages/jquery-clipboard/jquery.clipboard.swf',
      copy: function() {
        var output = "";
            console.log('copy process started...: ' + sessionPost)
            console.log(sessionPost)
        _.each(sessionPost.sessions, function(sess) {
            output += "\r\n";
          _.each(sess.paragraphs, function(para) {
            console.log('copy process: ' + para)
            output += para;
          });
        });

        // set a "copied" message for a few secs
        var btnVal = $('.post-nav-copy').html();
        $('.post-nav-copy').html('<span class="glyphicon glyphicon-ok"></span> ' + 'Copied.');
        setInterval(
          function(){
            $('.post-nav-copy').html(btnVal);
          }
          ,3000);
        return output;
     }
   });   
}

$('.postEditSession--editable').on('focus', '[contenteditable]', function() {
    var $this = $(this);
    $this.data('before', $this.html());

    edited();
    return $this;
}).on('blur keyup paste input', '[contenteditable]', function() {
    var $this = $(this);
    if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
        $this.trigger('change');
    }

    edited();
    return $this;
});
