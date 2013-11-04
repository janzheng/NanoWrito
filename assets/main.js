



var hasFlash = (swfobject.hasFlashPlayerVersion('1') && true);

// copy functionality. Check for swf availability first
if(hasFlash) {
	var clip = new ZeroClipboard( document.getElementById("copy-btn"), {
	  moviePath: "assets/ZeroClipboard.swf"
	} );

	//this event happens upon initiating the copy 
	clip.on( 'dataRequested', function ( client, args ) {
	    clip.setText( $('.entry-list').text());
	} );
} else {
	$('.copy').hide(); //no need for click to copy button
}


var nanoApp = angular.module('nanoApp', ['ui.utils']);
 
// nanoApp.factory('Nano', function () {
//   return { tmp: "I'm data from a service" }
// });

// nanoApp.filter('reverse', function () {
//   return function (text) {
//     return text.split("").reverse().join("");
//   }
// });
 
// function mainCtrl($scope, Nano) {
//   $scope.nano = Nano;



function mainCtrl($scope) {
	$scope.nano = [];
	$scope.nano.entries = [];
	$scope.nano.typed = '';
	$scope.nano.typeCount = 0;
	$scope.nano.totalCount = 0;
	$scope.nano.copytext = 'Click to Copy';

   //console.log ('typed: ' +  (!$scope.nano.typed || 0 === $scope.nano.typed.length) ? 66 : $scope.nano.typed.split(' '))

	$scope.onEnter = function(e) {
		$scope.nano.tmp = $scope.nano.typed;
		$scope.nano.entries.push($scope.nano.typed + '\r\n' + '\r\n');
		$scope.nano.typed = "";
		$scope.nano.zen = false;

		// $scope.nano.totalCount += $scope.nano.typeCount; //update total on enter;
		$scope.nano.typeCount = 0;
		scrollTo($('#bottom'));
	}

	$scope.onUpdate = function() {
		var ctr = $scope.nano.typeCount;
		$scope.nano.typeCount = ($scope.nano.typed.match(/\S+/g)||[]).length;
		if ($scope.nano.typeCount > ctr) {
			$scope.nano.totalCount++;
		}else if ($scope.nano.typeCount < ctr) {
			$scope.nano.totalCount -= ctr - $scope.nano.typeCount; // user erases words
		}
	}

	$scope.startZen = function(e) {
		console.log('start zen');
		$scope.nano.zen = true;
		console.log('zen state: ' + $scope.nano.zen)
	}

	$scope.stopZen = function(e) {
		console.log('stop zen');
		$scope.nano.zen = false;
		console.log('zen state: ' + $scope.nano.zen)
	}

	if(hasFlash) {
		//this event happens upon the copy finishing
		clip.on( 'complete', function(client, args) {
			$scope.nano.copy = "Text copied.";
			clip = new ZeroClipboard( document.getElementById("copy-btn"), { moviePath: "assets/ZeroClipboard.swf"} );
		} );
	}


    var ctrlDown = false;
    var ctrlKey = 17;
	$(window).keydown(function(e){
        if (e.keyCode == ctrlKey) ctrlDown = true;
    }).keyup(function(e){
        if (e.keyCode == ctrlKey) ctrlDown = false;
    });

	$(document).keyup(function(e) {
		var scope = angular.element('body div').scope();

		if ((ctrlDown==true) && (e.keyCode == 32)) {
			scope.startZen();
			scope.$apply();
		}
		if(e.keyCode == 27) {
			$scope.stopZen();
			scope.$apply();
		}
    });

}

// directives

// onEnter keypress
nanoApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            // if(event.which === 13 && !event.shiftKey) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
            else if(event.which === 23) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});




// jQuery smooth scrolling
var scrollElement = 'html, body';
	function scrollTo(hash) {
		// var item = $(item),
		$target = $(hash);

		$(scrollElement).stop().animate({
		  'scrollTop': $target.offset().top
		}, 500, 'swing', function() {
		  window.location.hash = hash
		});

}

window.onbeforeunload = function (event) {
  var message = "Oh hey. Don't forget to save your work.";
  if (typeof event == 'undefined') {
    event = window.event;
  }
  if (event) {
    event.returnValue = message;
  }
  return message;
}