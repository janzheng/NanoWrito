


var sessionCounter = 0;
var post;


Template.postSelected.created = function() {
  post = this.data.postItem;
var sessionCounter = 0;
}

// used for setting selected / active class on post list
Template.postSelected.rendered = function() {


  $( "body" ).change(function() {
    console.log( "novel content DOM change." );
  });

  // check for Flash (for copy to clipboard)
  Session.set('hasFlash', (swfobject.hasFlashPlayerVersion('1') && true));
  Session.set('sessionId', '') //the current object that's being edited
  Session.set('activeId', this.data.activeId);  //used to highlight the left-hand rail
  Session.set('configure', false); //
  Session.set('sessionDisplay', true); // display as sessions (true) or as paragraph only (false) - necessary for non-flash to copy


  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  console.log($('.post-paragraph').get(0));



  // Callback
  // use MutationObserver to track DOM changes for completion callback
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var observer = new MutationObserver(function(mutations, observer) {
      // fired when a mutation occurs
      // console.log('mutation occurred')
      // console.log(mutations, observer);
      setAutosize(); //resize on DOM mutations
      // ...
  });

  observer.observe($('.post-novel-content').get(0), {
    subtree: true,
    attributes: true,
    characterData: true,
  });




  // set the novel title
  $('.text-title').val(post.title);

  // reset the session counter (used for counting session # for the list)
  sessionCounter = 0;

  // initialize clipboard copy
  initClipboard();

  // set autosize. Need a timer because some paragraphs might not have finished filling in yet
  // no idea how to set a reactive callback
  setTimeout(function(){setAutosize()},400)

}

Template.postSelected.destroyed = function() {
  Session.set('activeId', 0);
  Session.set('sessionId', '') //the current object that's being edited
  Session.set('configure',false);
}


Template.postSelected.helpers({
  username: function() {
    return Meteor.user().profile.name;
  },
  hasFlash: function() {
    return Session.get('hasFlash');
  },
  getPostSessionDate: function() {
    var time = moment(this.sessionDate);
    return time.format('MM/D/YY, h:mm:ss a');
  },
  resetSessionCounter: function() {
    sessionCounter=0;
  },
  getSessionCounter: function() {
    return "Session " + ++sessionCounter;
  },
  getSessionWords: function() {
    var counter = 0;
    _.each(this.paragraphs, function(paragraph) {
      if(paragraph.length>0)
        counter += paragraph.match(/\S+/g).length;
    });
    return counter;
  },
  getWordCount: function() {
    var counter = 0;
    _.each(this.sessions, function(sess) {
      _.each(sess.paragraphs, function(paragraph) {
        if(paragraph.length>0)
          counter += paragraph.match(/\S+/g).length;
      });
    });
    return addCommas(counter);
    // var words = _.flatten(array, [shallow]) 
  },
  getSessionCount: function() {
    return addCommas(this.sessions.length);
  },
  userTextSize: function() {
    if(Session.get('userLoggedIn'))
      return "user-textsize--" + Meteor.user().profile.textsize;
  },
  getPostId: function() {
    if(typeof post != 'undefined') {
      return post._id;
    }
  },
  getSessionId: function() {
    return this.sessionId;
  },
  getParagraphs: function() {
    var output = "";
    _.each(this.paragraphs, function(paragraph) {
      output += paragraph;
    });
    // console.log('getpara')
    // $('.post-paragraph').autosize();
    return output;
  },
  isEditing: function() {
    // is the user currently editing this session?
    if (Session.get('sessionId') == this.sessionId)
      return true;
  },
  editDisabled: function() {
    if (Session.get('sessionId') != '')
      return 'post-edit-disabled';
  },
  postSettingsClass: function() {
    if (Session.get('configure'))
      return 'post-settings-open';

    return 'post-settings-closed';
  },
  postSettingsButton: function() {
    if (Session.get('configure'))
      return 'post-settings-btn-active';
    return 'post-settings-inactive';
  },
  displayMode: function() {
    if (Session.get('sessionDisplay'))
      return 'Session';
    return 'Paragraph';
  },
  displayModeIsSession: function() {
    if (Session.get('sessionDisplay'))
      return true;
    return false;
  },
});


Template.postSelected.events({
  'keyup .text-title': function(e) { 

    var obj = {
      _id: this._id,
      title: $('.text-title').val(),
    }

    Meteor.call('updateTitle', obj, function(error, id) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
        return false;
      }
    });
   },

  'click .post__save': function(e) {

    var postId = this._id;
    var post = {
      title: $('[name=title]').val(),
      content: $('[name=content]').val(),
      _id: postId
    }

    // console.log('updating postEdit title obj ' + post.title);

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
        // console.log('update title complete...');
      }
    });

  },

  // allows users to edit the session
  'click .post-edit': function(e) {

    // need to do an edit check here
    if (Session.get('sessionId') == '') {
      var elem = $(e.currentTarget)
      // console.log('edit ' + elem.data('postid'))

      Session.set('sessionId', elem.data('sessionid'))

      // $('.post-paragraph[data-postid="'+elem.data('postid')+'"]').attr('contenteditable','true');
      // var value = $('.post-paragraph[data-postid="'+elem.data('postid')+'"]').val()
      $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').removeAttr('readonly');
      $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').autosize();
      $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').trigger('autosize.resize');

      $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').addClass('post-paragraph-edit-active');
    }
  },

  'click .post-edit-save': function(e) {
      var elem = $(e.currentTarget)
      var id = post._id;
      var session = _.findWhere(post.sessions, {sessionId: Session.get('sessionId')});

      // apparently extracting text w/ linebreaks is stupid across different browsers.
      // http://stackoverflow.com/questions/13762863/contenteditable-field-to-maintain-newlines-upon-database-entry
      var paraElem = $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]');
      // var paragraph = paraElem.html()
      //                  .replace(/<br(\s*)\/*>/ig, '\n') // replace single line-breaks
      //                  .replace(/<[p|div]\s/ig, '\n$0') // add a line break before all div and p tags
      //                  .replace(/(<([^>]+)>)/ig, "");   // remove any remaining tags

      // paragraph = _.unescape(paragraph);
      var paragraph = paraElem.val();

      console.log('test paragraph 0000000000 --------------------------------');

      console.log('VALUE?!:');
      console.log(paraElem.val());

      console.log('TEXT:');
      console.log(paraElem.innerText);
      console.log('test paragraph 111 --------------------------------');
      console.log(paraElem.children());
      // paragraph = paragraph
      //                  .replace(/<br(\s*)\/*>/ig, '\n') // replace single line-breaks
      //                  .replace(/<[p|div]\s/ig, '\n$0') // add a line break before all div and p tags
      //                  .replace(/(<([^>]+)>)/ig, "");   // remove any remaining tags

      // console.log(paraElem.html()));
      // console.log(getTextNodesIn(paraElem.get(0)));
      var paraa = getTextNodesIn(paraElem.get(0));


      console.log('text nodes PARA OUTPUT::::::: ' );
      console.log(paraa);
      // var output = "";
      // _.each(textnodes, function(node) {
      //   console.log('copy process: ' + node.text)
      //   output += node.text;
      // });

      // console.log(" NODE OUTPUT  123123123123123123121231");
      // console.log(output);

      // var nodelist = htmlDecodeWithLineBreaks(paraElem.get(0));
      // console.log(nodelist);


      console.log('test paragraph 222 --------------------------------: ');
      // paragraph = htmlDecodeWithLineBreaks(paragraph);
      console.log(paragraph);

      Meteor.call('updateSession', id, session, paragraph, function(error, id) {
        if (error) {
          // display the error to the user
          Errors.throw(error.reason);
          return false;
        }

        // set the displayed text to the sanitized value
        // paraElem.val(paragraph);

        // need to clear output since Chrome, FF like adding <div>, <br> and other crazy stuff
        // paraElem.children('div').each(function(i) {
        //   console.log('erase')
        //   $(this).remove();
        // });

        // repopulate this div
        // paraElem.text(session.paragraphs[0])

        // $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').attr('contenteditable','false');
        $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').removeAttr('readonly');
        $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').removeClass('post-paragraph-edit-active');

        // clear the edit session
        Session.set('sessionId','');
      });
  },
  // cancel edit mode without saving anything
  'click .post-edit-cancel': function(e) {
    Session.set('sessionId','');

    // restore paragraph to original
    var session = _.findWhere(post.sessions, {sessionId: Session.get('sessionId')});
    var output = "";
    var elem = $(e.currentTarget);

    _.each(this.paragraphs, function(paragraph) {
      output += paragraph;
    });

    $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').val(output);
    $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').prop('readonly', true);
    $('.post-paragraph[data-sessionid="'+elem.data('sessionid')+'"]').removeClass('post-paragraph-edit-active');
  },

  // delete the entire novel
  'click .post-nav-delete': function(e) {

    if (confirm("Permanently Delete this Post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('/');
    }
  },

  // delete a specific session, after a user has clicked "edit" on the session
  'click .post-edit-delete': function(e) {

    if (confirm("Permanently Delete this Session?")) {
      var id = post._id;
      var session = _.findWhere(post.sessions, {sessionId: Session.get('sessionId')});
      Meteor.call('deleteSession', id, session, function(error, id) {
        if (error) {
          // display the error to the user
          Errors.throw(error.reason);
          return false;
        }
        Session.set('sessionId','');
      });
    }
  },

  'click .post-settings-configure': function(e) {
    if(Session.get('configure'))
      Session.set('configure',false);
    else
      Session.set('configure',true);
  },

  // display paragraphs or sessions
  // editing only works in sessions, but paragraph view might be preferred by some
  'click .post-settings-display-mode': function(e) {
    if(Session.get('sessionDisplay'))
      Session.set('sessionDisplay',false); // paragraph mode when false
    else
      Session.set('sessionDisplay',true); // sessions mode when true
  }
});


// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            console.log('copy process started...: ' + post)
            console.log(post)
        _.each(post.sessions, function(sess) {
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
// <div><br></div>
// http://stackoverflow.com/questions/4502673/jquery-text-function-loses-line-breaks-in-ie
function htmlDecodeWithLineBreaks(html) {
  // problem matches:
  // chrome adds: <div></div> to newlines by wrapping. Need to add a -newline- to <div> and get rid of </div>
  // chrome adds: <div><br></div> to multiple newlines. Replace with -newline-
  // IE adds: <br> to newlines. Replace <br> with -newline- after the chrome <br> issue
  // FF adds: <p> to newlines. Need to add a -newline- to <p> and get rid of </p>
  var breakToken = '_______break_______',
  // .replace(/<div\.*?><br\s?\/?><\/div>/gi, breakToken) //used for chromes stupid <div><br></div>
      lineBreakedHtml = html.replace(/<div\.*?><br\s?\/?><\/div>/gi, breakToken).replace(/<br\s?\/?>/gi, breakToken).replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + '$1').replace(/<div\.*?>(.*?)<\/div>/mgi, breakToken + '$1');
  
      console.log('linebreakdhtml 3333------------------------')
      // console.log('linebreakdhtml')
  return $('<div>').html(lineBreakedHtml).text().replace(new RegExp(breakToken, 'g'), '\n');

  // var node = html;
  // console.log("node >>> ")
  // console.log(node)

  // var text = "";
  // for (var child = node.firstChild; !!child; child = child.nextSibling) {
  //   if (child.nodeType === 3) {
  //     text += child.nodeValue;
  //   }
  // }
  // console.log("node text >>> ")

  // return text;
    // _.each(this.paragraphs, function(paragraph) {
    //   counter += paragraph.match(/\S+/g).length;
    // });
}




function getTextNodesIn(node, includeWhitespaceNodes) {
    var textNodes = [], nonWhitespaceMatcher = /\S/;
    var paragraph = [];

    function getTextNodes(node) {
        console.log('***********')
        console.log('gettextnodes - type: ' + node.tagName)
        console.log(node + ' - ' + node.nodeValue)
        console.log('***********')
        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
                textNodes.push(node);
                paragraph.push(node.nodeValue)
            }
        } else {

          // push <br> node in
          if (node.tagName == 'BR') {
            console.log('err found')
            textNodes.push(document.createTextNode("LINE BREAK"));
            paragraph.push("\r\n")
          }
          for (var i = 0, len = node.childNodes.length; i < len; ++i) {
            getTextNodes(node.childNodes[i]);
          }
        }
    }

    getTextNodes(node);
    return paragraph;
}

function textFilter(obj) {
  console.log('---------- TEXT FILTER -----------');
  console.log(obj.contents());

  var obj = $( obj )
              .contents()
                .filter(function() {
                  return this.nodeType === 3;
                })
                  .wrap( "<p></p>" )
                  .end()
                .filter( "br" )
                .remove();


  return obj;
}

function setAutosize() {
  $('.post-paragraph').autosize();
}



// use MutationObserver to track DOM changes for completion callback
// MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// var observer = new MutationObserver(function(mutations, observer) {
//     // fired when a mutation occurs
//     console.log('mutation occurred')
//     console.log(mutations, observer);
//     // ...
// });
