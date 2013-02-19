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
	
	watcher = null;
	
	geolocationState = 'geolocation-off';
	
	$('#geolocation-data').hide();	
	
	$('#geolocation-switch').change(function() {
      geolocationState = $("select#geolocation-switch").val();
      navigator.geolocation.clearWatch(watcher);
      geolocation(geolocationState);
  });
  
  // call geolocation() at least once
  geolocation(geolocationState);
    
});

function geolocation(geolocationState) {
  /* Geolocation switch logic
	*
	*   If geolocation-switch = 'off',
	*   then navigator.geolocation.clearWatch(watcher);
	*   
	*   If geolocation-switch = 'on',
	*  then watcher = navigator.geolocation.watchPosition(successCallback, 
  *              errorCallback, options);
  *               
  */

  if (geolocationState == 'geolocation-on') {
    	  
	  // var watcher = null;
    var options = {
      enableHighAccuracy: true,
      timeout: 100
    };

    if (window.navigator.geolocation) {
      watcher = navigator.geolocation.watchPosition(successCallback, 
                  errorCallback, options);
    } else {
      $('#geolocationStatus').text('Your browser does not natively support geolocation.');
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
      myLatitude = Math.round(position.coords.latitude*1000000)/1000000 ;
      
      myLongitude = Math.round(position.coords.longitude*1000000)/1000000 ;
      
      myAccuracy = Math.round(position.coords.accuracy*1000)/1000 + ' m' ; // meters      
      
      myAltitude = position.coords.altitude != null ? Math.round(position.coords.altitude*1000)/1000 + ' m' : 'Not available'; // meters
      
      myAltitudeAccuracy = position.coords.altitudeAccuracy != null ? Math.round(position.coords.altitudeAccuracy*1000)/1000 + ' m' : 'Not available'; // meters
            
      myHeading = position.coords.Heading != null ? Math.round(position.coords.Heading*1000)/1000 + ' degrees' : 'Not available'; // degrees
      
      mySpeed = position.coords.Speed != null ? Math.round(position.coords.Speed*1000)/1000 + ' m/s' : 'Not available'; // meters per second
      
      myTimestamp = new Date(position.timestamp + 946684799241).toLocaleString(); // DOMTimeStamp in user's local time
      // For some reason position.timestamp returns the wrong year.
      // I'm adding just under 30 years in order to get the correct time in Safari
      // 946684799241 milliseconds = 29.9992717681374 years

      /* 
          DOMTimeStamp

          Number of milliseconds since the epoch,
          defined as midnight of the morning of January 1, 1970
      */

      /* Print Geolocation Status */
      $('#geolocationStatus').text('');
      
      /* Show Geolocation data table */
      $('#geolocation-data').show();

      /* Print Geolocation API properties */
      $('#myLatitudeIs').text(myLatitude);
      $('#myLongitudeIs').text(myLongitude);
      $('#myAccuracyIs').text(myAccuracy);
      $('#myAltitudeIs').text(myAltitude);
      $('#myAltitudeAccuracyIs').text(myAltitudeAccuracy);
      $('#myHeadingIs').text(myHeading);
      $('#mySpeedIs').text(mySpeed);
      $('#myTimestampIs').text(myTimestamp);
      
      /* The following section calculates and displays
         the distance from the devices current location
         to Sertino's Coffee Cafe, the awesome cafe where
         this code was written.
         
         http://www.yelp.com/biz/sertinos-cafe-huntington-beach
         
         */
         
      /* Calculate distance 
         distance = haversine(lat1, lon1, lat2, lon2)  */
      
      var myDistanceToSertinos = haversine(33.6581196, -118.0022576, myLatitude, myLongitude);
      myDistanceToSertinos = Math.round(myDistanceToSertinos * 1000)/1000;
      
      // Adjusts location tolerance based on position accuracy
      // converts accuracy unit (m) to haversine distance unit (km)
      var locationTolerance = myAccuracy / 1000 ;
      if (myDistanceToSertinos < locationTolerance) {
        $('#myDistanceToSertinosIs').html("You're at Sertino's Coffee Cafe! <br/>That's where this geolocation boilerplate was written! <br/>Well... maybe not, but you're certainly within " + myAccuracy + " m.");
      } else
      {
        $('#myDistanceToSertinosIs').text("My distance to the cafe where geolocation boilerplate was written is: "
         + myDistanceToSertinos + " km.");
      }
      
    }

    function errorCallback(error) {
      // There was a problem getting the location
      switch (error.code) {
        case error.PERMISSION_DENIED:
          $('#geolocationStatus').text('Error: You have denied access to your position.');
          break;
        case error.POSITION_UNAVAILABLE:
          $('#geolocationStatus').text('Error: There was a problem getting your position.');
          break;
        case error.TIMEOUT:
          $('#geolocationStatus').text('Error: The application has timed out attempting to get your location.');
          break;
      }
    }
	} else
	{
	  $('#geolocationStatus').text('Turn geolocation on to activate GPS and view your location.');
	  $('#myDistanceToSertinosIs').text("");
	  $('#geolocation-data').hide();
	  navigator.geolocation.clearWatch(watcher);
	}

}

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