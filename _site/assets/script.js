
// ************************************************************
// JS Snippets
// ************************************************************


$(document).ready(function() {


// ************************************************************
// Modal Lightbox
// Container that shows or hides its content based on input


function modalCloseAll() {
  $(".modal-item").hide();
  $("#modal").hide();
}

$(".login-btn").click(function() {
  $("#modal").fadeIn(400);
  $("#modal-login").fadeIn(400);
});

$(".signup-btn").click(function() {
  $("#modal").fadeIn(400);
  $("#modal-signup").fadeIn(400);
});

$(".blanket").click(function(event) {
  modalFadeOut();
});

function modalFadeOut() {
    $("#modal").fadeOut(400, function() {modalCloseAll()});
}


$(".signup-btn").click(function() {
  $("#modal").fadeIn(400);
  $("#modal-signup").fadeIn(400);
});


$(".switch-to-login").click(function() {
  switchToLogin();
});
$(".switch-to-signup").click(function() {
  switchToSignup();
});


function switchToLogin() {
  $("#modal-signup").fadeOut(250, function() {$("#modal-login").fadeIn(250);});
}
function switchToSignup() {
  $("#modal-login").fadeOut(250, function() {$("#modal-signup").fadeIn(250);});
}


// End Modal Lightbox
// ************************************************************




// ************************************************************
// Reveal
// Container that shows or hides its content based on input

// .reveal-container .reveal-btn-container
//    .reveal-btn
//    .reveal-content

// Clicking on the reveal-btn or reveal-btn-container will show or hide the content within .reveal-content
// you can create multiple .reveal-btns, like an Open and a Close button

// In the following example, these are used for responsively hiding sections which would be too big for a mobile screen
$(".reveal-btn").click(function() {
  var width = $(window).width();
  if( width <= 480 ){toggleMobile($(this).parent());}
});

$(".reveal-btn-container").click(function() {
  var width = $(window).width();
  if( width <= 480 ){toggleMobile(this);}
});

function toggleMobile(input){
  var state = $(input).find('.reveal-content').css('display');
  
  if (state == 'none'){
    // if content is hidden
    showMobile(input);
  } else { 
    // if content is revealed
    hideMobile(input); 
  }
}

function showMobile(input) {
    $(input).find('.reveal-content').css('display', 'block');
}

function hideMobile(input) {
    $(input).find('.reveal-content').css('display', 'none');
}

// End Reveal
// ************************************************************



// ************************************************************
// Goto-Highlight / Nav highlighting

  // $(function() { 
  //   $('.goto')
  //     .waypoint(function(direction) {
  //       var $links = $('a[href="#' + this.id + '"]');
  //       if(direction === 'down') {
  //         $('.menu-selected').removeClass('menu-selected');
  //         $links.addClass('menu-selected', direction === 'down');
  //         // console.log("Entering: " + direction + " @ " + this.id);
  //       }
  //     },{ offset: 100 })
  //     .waypoint(function(direction) {
  //       var $links = $('a[href="#' + this.id + '"]');
  //       if(direction === 'up') {
  //         $('.menu-selected').removeClass('menu-selected');
  //         $links.addClass('menu-selected', direction === 'up');
  //         // console.log("(up) Going: " + direction + " @ " + this.id);
  //       }
  //     },{ offset: function() {
  //         return -$(this).height();
  //       } });
  // });

// End Goto-Highlight
// ************************************************************


// ************************************************************
// Smooth Scrolling 

  //smooth scrolling, stolen from http://imakewebthings.com/jquery-waypoints/script.js :)
  // "Wicked credit to
  // http://www.zachstronaut.com/posts/2009/01/18/jquery-smooth-scroll-bugs.html"
  var scrollElement = 'html, body';
  
  // Smooth scrolling for internal links
  $("a").click(function(event) {
    if(this.href.match('#') && getRootUrl(this) == getRootUrl(window.location)) {
      target = this.hash;
      event.preventDefault();
      scrollTo(target);
    }
  });

  // check for location hash if loaded from another page or link looks like site.html#link
  if(window.location.hash) {
    // Fragment exists
    var hash = window.location.hash;
    window.location.hash = "#";
    scrollTo(hash);
  }

  function getRootUrl(url) {
    return String(url).substr(0,String(url.href).indexOf('#'));
  }
  function scrollTo(hash) {
    // var item = $(item),
    $target = $(hash);
    
    $(scrollElement).stop().animate({
      'scrollTop': $target.offset().top
    }, 500, 'swing', function() {
      window.location.hash = hash
    });

  }

  

// End Smooth Scrolling
// ************************************************************

}); // end .ready



