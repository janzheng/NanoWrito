
// set session variable at start of the app
Session.set('title', "" );
Session.set('paragraphs', [] );
Session.set('wordCount', 0 );   //stored # words in entire story
Session.set('curCount', 0 );    //wordCount + inputCount; real-time word value
Session.set('inSession', false );    //flag for keeping track sessions
Session.set('hasFlash', false);


var userLoggedIn = Session.get('userLoggedIn');
var userId = Meteor.userId();
var postId; //calculated on render
var post;


Template.writeApp.created = function() {
  console.log('Write App Created');
  Session.set('inSession', true);
}


Template.writeApp.destroyed = function() {
  console.log('Write App Destroyed');
  Session.set('inSession', false);

}


Template.writeApp.rendered = function() {

  inputFocus();

  // check for Flash (for copy to clipboard)
  Session.set('hasFlash', (swfobject.hasFlashPlayerVersion('1') && true));

  // REset session variable at render
  // the session is used every time writeApp loads, for people to keep track of productivity
  Session.set('sessionDate', moment().toString() ); 
  Session.set('title', "" );
  Session.set('paragraphs', [] );
  Session.set('wordCount', 0 );       // stored # words in entire story
  Session.set('curCount', 0 );        // wordCount + inputCount; real-time word value
  Session.set('contentToNew','');     // used to convert paragraphs into a new novel when users have written then log in

  postId = ( !!this.data && !!this.data._id ) ? this.data._id : undefined;
  post = Posts.findOne(postId);
  if(postId && (typeof post != 'undefined'))
    Session.set('title', post.title);
  // console.log("Write App loaded. Current user: " +  Meteor.userId() + " Current postId: " + postExists() + " > " + postId + " user loggedin: " + Session.get('userLoggedIn') );

  // initialize clipboard copy
  initClipboard();

  // initialize the novel if it exists
  populate();

}


Template.writeApp.helpers({
  title: function() {
    return Session.get('title');
  },
  hasFlash: function() {
    return Session.get('hasFlash');
  },
  // hide the output area if no entries
  inputClass: function() {
    if (Session.get('paragraphs').length == 0) {
       return 'hide';
    }
  },
  textOutput: function() {

    //add newline to each line. don't know yet if we want to store these in the text array, prob not.
    // return _.each(Session.get('content'), function(elem, index, list) {
       // console.log('element entry: ' + elem); //add a newline here?
    // })

    var paragraphs = Session.get('paragraphs');
    var output = "";
    $.each(paragraphs, function( index, value ) {
      output += "<p>"+value+"</p>";
    });

    return output;
  },
  wordCount: function() {
    return addCommas(Session.get('curCount'));
  },
  userTextSize: function() {
    if (Session.get('userLoggedIn'))
      return "user-textsize--" + Meteor.user().profile.textsize;
  },
  optionWordcount: function() {
    if (Session.get('userLoggedIn'))
      return "user-wordcount--" + Meteor.user().profile.wordcounter;
  },
  novelTypeDesc: function() {
    //returns text for the type of novel
    novelType = Session.get('selectedType');
    if(novelType == 'nanowrimo') {
      return 'NaNoWriMo Mode. ';
    } else if(novelType == 'monthly') {
      return '30-Day Challenge Mode. ';
    } else if(novelType == 'weekly') {
      return '7-Day Challenge Mode. ';
    } 
    // return 'wat ' + novelType;

  }
});


Template.writeApp.events({
   'keydown .text-input-area': function(e) { 

      // user hits enter
      if(e.keyCode === 13) {

        // update word count
        var wordCount = Session.get('wordCount');
        Session.set('wordCount', wordCount + count($('.text-input-area').val())); // update to newest count

        var paragraphs = Session.get('paragraphs');

        //add the newlines here b/c it makes life easier later
        var content = $('.text-input-area').val() + '\r\n' + '\r\n';
        paragraphs.push(content);
        Session.set('paragraphs', paragraphs);

        $('.text-input-area').val('');
        scrollDown($('#bottom'));

        // if this post doesn't exist we create a fresh novel for the user. they can always delete them later
        novelCreate();

        // create and update latest session, on enter. Push the newest paragraph into db
        novelSave(content);



        // if user not logged on, and has written something, we store the paragraph info
        // into a temp. variable used to create a new Novel entry if user logs in
        // if user is currently logged in, we ensure it's cleared
        if(!Session.get('userLoggedIn')) {
          Session.set('contentToNew',Session.get('paragraphs'));
        }

        e.preventDefault();
      }
      Session.set('curCount', Session.get('wordCount') + ($('.text-input-area').val().match(/\S+/g)||[]).length);
   },
   'click .btn-zen': function(e) {
      toggleZen();
   },
   'click .blanket': function(e) {
      toggleZen();
   }
});



function toggleZen() {
   if(Session.get('zenMode') != 'zen' && Session.get('inSession') ) {Session.set('zenMode', 'zen');}
   else {Session.set('zenMode', '');}
   inputFocus();
}





// 
// DB Helpers
// 

// 
// Populate
// 
function populate() {
  if(postExists()) {
    // Session.set('title', post.title );
    // Session.set('paragraphs', post.paragraphs);
    // Session.set('curCount', ($('.text-input-area').val().match(/\S+/g)||[]).length);
  }
}

function novelCreate() {

   //check for user and post duplication
   if (postExists() || !Session.get('userLoggedIn')) { return null; }

   var obj = {
      // nothing to see here
      // placeholder in case we need later

      novelType: Session.get('selectedType') // set in the post_write.js from user selection
   }

   Meteor.call('newPost', obj, function(error, id) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
        return false;

      } else {
        post = Posts.findOne(id);
        postId = id;
        console.log('Novel saved as: ' + id);
        novelSave(Session.get('paragraphs')[0]); //perform a save after new post has been created (async). save what's in session
      
      }
   });
}


// 
// Save Novel
// 

var novelSave = function (paragraph) {
  //check for user and post duplication
  if (!postExists() || !Session.get('userLoggedIn')) { return null; }

  console.log('retrieving stored post...')
  console.log(Posts.findOne(postId));
  console.log('post count: ' + Posts.find().count());


  // console.log('novelsave: post exists: ' + postExists() )
  // create a new session if one hasn't been created, using session date as Id)
  // push the new entries into the current set
  //   - parapraphs: ["text","text",...] (each is a paragraph - eventually can track time per paragraph)
  //   - date: new Date().getTime()

  var obj = {
    postId: postId,
    sessionDate: Session.get('sessionDate'), 
    paragraph: paragraph
  }

  Meteor.call('updatePost', obj, function(error, id) {
    if (error) {
      // display the error to the user
      Errors.throw(error.reason);
      return false;
    }
  });
}








// 
// Other helper functions
// 

// scroll to the bottom when users type
var scrollElement = 'html, body';
function scrollDown(hash) {
  // var item = $(item),
  $target = $(hash);

  $(scrollElement).stop().animate({
    'scrollTop': $target.offset().top
  }, 500, 'swing', function() {
    window.location.hash = '#'
  });
}

// 
// Copy to Clipboard functionality
// 

// does this post exist in the DB? 
// given through the routes postWrite and postEdit
function postExists() {
   return !(postId === undefined);
}

function initClipboard() {

   var copy_sel = $('.btn-copy');
   copy_sel.on('click', function(e) {
      e.preventDefault();
    });

   // Apply clipboard click event
   // Copy directly from session, not from the html
   copy_sel.clipboard({
      path: 'packages/jquery-clipboard/jquery.clipboard.swf',
      copy: function() {
        var paragraphs = Session.get('paragraphs');
        var output = "";
        $.each(paragraphs, function( index, value ) {
          output += value;
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


// use ESC key to toggle Zen mode
$(document).keyup(function(e) {
  if(e.keyCode === 27) {
    toggleZen();
  }
  e.preventDefault();
});

// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function count(string) {
  return((string.match(/\S+/g)||[]).length);
}

function inputFocus() {
  $('input[autofocus="autofocus"]').focus();
}

// 
// Close Window Alert
// 

window.onbeforeunload = function (event) {

  // if no user logged in we warn them about closing the browser
  if(!Session.get('userLoggedIn')) {

    var message = "Oh hey. Don't forget to copy your work to your computer, or sign in.";
    if (typeof event == 'undefined') {
      event = window.event;
    }
    if (event) {
      event.returnValue = message;
    }
    return message;
  }
}
      
