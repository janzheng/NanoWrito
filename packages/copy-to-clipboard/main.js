

// 
// ZeroClipboard Copy to Clipboard
// 

// 
// swfObject - check if Flash exists
// 


$(document).ready(function() {
   console.log("copy-to-clipboard: init");

   var hasFlash = (swfobject.hasFlashPlayerVersion('1') && true);

   if(hasFlash) {
      console.log("copy-to-clipboard: flash detected");
   	var clip = new ZeroClipboard( document.getElementById("copy-btn"), {
   	  moviePath: "packages/copy-to-clipboard/ZeroClipboard.swf"
   	} );

      //this event happens upon the copy finishing
      clip.on( 'complete', function(client, args) {
         $scope.nano.copy = "Text copied.";
         clip = new ZeroClipboard( document.getElementById("copy-btn"), { moviePath: "packages/copy-to-clipboard/ZeroClipboard.swf"} );
      } );

   	//this event happens upon initiating the copy 
   	clip.on( 'dataRequested', function ( client, args ) {
   	    clip.setText( $('.entry-list').text());
   	} );

   } else {
      console.log("copy-to-clipboard: flash undetected");
   	$('.copy').hide(); //no need for click to copy button
   }

});