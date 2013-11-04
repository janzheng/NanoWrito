



// copy functionality
var clip = new ZeroClipboard( document.getElementById("entries"), {
  moviePath: "assets/ZeroClipboard.swf"
} );

//this event happens upon initiating the copy 
clip.on( 'dataRequested', function ( client, args ) {
    clip.setText( $('#entries').text());
} );

//this event happens upon the copy finishing
clip.on( 'complete', function(client, args) {
	console.log('text copied: ' + args.text)
} );


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

   //console.log ('typed: ' +  (!$scope.nano.typed || 0 === $scope.nano.typed.length) ? 66 : $scope.nano.typed.split(' '))

	$scope.onEnter = function(e) {
		$scope.nano.tmp = $scope.nano.typed;
		$scope.nano.entries.push($scope.nano.typed);
		$scope.nano.typed = "";

		// $scope.nano.totalCount += $scope.nano.typeCount; //update total on enter;
		$scope.nano.typeCount = 0;
		scrollTo($('#bottom'));
	}

	$scope.onUpdate = function() {
		var ctr = $scope.nano.typeCount;
		$scope.nano.typeCount = $scope.nano.typed.split(' ').length;
		if ($scope.nano.typeCount > ctr) {
			$scope.nano.totalCount++;
		}
	}

	$scope.startZen = function(e) {
		console.log('start zen');
	}

	$scope.stopZen = function(e) {
		console.log('stop zen');
	}

$scope.keypressCallback = function($event) {
alert('Voila!');
$event.preventDefault();
};

}

function hello(e) { console.log('eeeeee')}

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

