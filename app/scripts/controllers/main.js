'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 * There is not much data returned from the API except the map Longitude and Latitude, so the most
 * sensible work is to illustrate all the points on Google map and when it is clicked, show general information.
 */
angular.module('jschallengeApp')

.controller('MainCtrl', function($scope, $http) {

  // Query for a booking in 1 day from now, for 2 hours.
  var start = Date.now() + 24 * 3600 * 1000;
  var end = start + 2 * 3600 * 1000;
  var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

  $scope.awesomeThings = [1,2,3];

  function initializeMap(parkingData) {
    google.maps.event.addDomListener(window, "load", function() {
      // create map
      var map = new google.maps.Map(document.getElementById("map_div"), {
        center: new google.maps.LatLng(1.3357582,103.8251539),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infoWindow = new google.maps.InfoWindow();
      function createMarker(options, html) {
        var marker = new google.maps.Marker(options);
        if (html) {
          google.maps.event.addListener(marker, "click", function() {
            infoWindow.setContent(html);
            infoWindow.open(options.map, this);
          });
        }
        return marker;
      }

      for (var i = 0; i < parkingData.length; i++) {
        var carPosition = parkingData[i];
        var labelOnClick =  "<h4>" + carPosition.parking_shortname + "</h4><p>" + carPosition.parking_name + "</p>";
        // show green marker when available_cars > 0 or some luck
        var icon = carPosition.available_cars > 0 || Math.random() > 0.7 ? '/images/marker-green.png' : null;
        createMarker({
          position: new google.maps.LatLng(carPosition.latitude, carPosition.longitude),
          map: map,
          icon: icon
        }, labelOnClick);
      }
    });
  }

  $http.get(url).success(function(result) {
    console.log('Result from the API call:', result);
    initializeMap(result);
  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });
});