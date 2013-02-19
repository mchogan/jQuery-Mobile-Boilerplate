/* 
	jQuery Mobile Boilerplate
	application.js
*/
$(document).on("pageinit", function(event){

  // if cache update is available, ask user to update
  if (window.applicationCache) {
      applicationCache.addEventListener('updateready', function() {
          var r = confirm('An update is available. Reload now?');
          if (r==true) {
              window.location.reload();
          }
      });
  }

  // custom code goes here

});