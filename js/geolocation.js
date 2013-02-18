/* 
	Geolocation.js
	
	Contributed by Michael C. Hogan
	  - Twitter: @mch82
		
	based on HTML5 Geolocation: Bringing Location to Web Applications
	  - by Anthony T. Holdener III
	  - http://shop.oreilly.com/product/0636920020004.do
*/
$(document).on("pageinit", function(event){
	// custom code goes here

  var watcher = null;
  var options = {
    enableHighAccuracy: true,
    timeout: 100
  };

  if (window.navigator.geolocation) {
    watcher = navigator.geolocation.watchPosition(successCallback, 
                errorCallback, options);
  } else {
    alert('Your browser does not natively support geolocation.');
  }

  function successCallback(position) {
    // Do something with a location here
    
    /* Define variables for Geolocation API properties */
    var myLatitude = '';
    var myLongitude = '';
    var myAccuracy = '';
    var myAltitude = '';
    var myAltitudeAccuracy = '';
    var myHeading = '';
    var mySpeed = '';
    /* var myTimestamp = ''; */
    
    /* Set variables for Geolocation API properties */
    myLatitude = position.coords.latitude ;
    myLongitude = position.coords.longitude ;
    myAccuracy = position.coords.accuracy ; // meters
    myAltitude = position.coords.altitude ; // meters    
    myAltitudeAccuracy = position.coords.altitudeAccuracy ; // meters
    myHeading = position.coords.Heading ; // degrees
    mySpeed = position.coords.Speed ; // meters per second
    myTimestamp = new Date(position.timestamp + 946684799241).toLocaleString(); // DOMTimeStamp in user's local time
    // For some reason position.timestamp returns the wrong year.
    // I'm adding just under 30 years in order to get the correct time in Safari
    // 946684799241 milliseconds = 29.9992717681374 years
        
    /* 
        DOMTimeStamp
        
        Number of milliseconds since the epoch,
        defined as midnight of the morning of January 1, 1970
    */
    
    /* Print Geolocation API properties */
    $('#myLatitudeIs').text(myLatitude);
    $('#myLongitudeIs').text(myLongitude);
    $('#myAccuracyIs').text(myAccuracy);
    $('#myAltitudeIs').text(myAltitude);
    $('#myAltitudeAccuracyIs').text(myAltitudeAccuracy);
    $('#myHeadingIs').text(myHeading);
    $('#mySpeedIs').text(mySpeed);
    $('#myTimestampIs').text(myTimestamp);
        
  }

  function errorCallback(error) {
    // There was a problem getting the location
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('You have denied access to your position.');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('There was a problem getting your position.');
        break;
      case error.TIMEOUT:
        alert('The application has timed out attempting to get your location.');
        break;
    }
  }
  
});

function toRad(value) {
  // Converts degres to radians
  return value * Math.PI / 180;
}

function haversine(lat1, lon1, lat2, lon2) {
  /*
    Adapted from...
    http://www.movable-type.co.uk/scripts/latlong.html
    
    Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
      Sky and Telescope, vol 68, no 2, 1984
  */
  
  var R = 6371 ; // km
  var dLat = toRad(lat2 - lat1) ;
  var dLon = toRad(lon2 - lon1) ;
  var lat1 = toRad(lat1) ;
  var lat2 = toRad(lat2) ;
  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2) ;
          
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) ;
  
  var d = R * c ;
  
  return d ;  
}