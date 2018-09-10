(function closure(module) {
  var googleMap;
  var google;
  var infowindow;
  var noWebGlMapView = {};

  noWebGlMapView.noWebGlMapinit = function(){
    $('.show-if-no-webgl').removeClass('hidden');
    $('.hide-if-no-webgl').addClass('hidden');
    $('.map-container-split').addClass('no-web-gl');
    $('.webGL-kill').click(function(){
      $('.webgl-banner').addClass('hidden');
    });
    mapView.webGL = false;
  };
//draws map
  module.initMap = function initMap() {
    if (mapView.webGL) {
      return;
    }
    google = window.google;

    // Initalize reusable infowindow
    infowindow = new google.maps.InfoWindow({maxWidth: 200});

    var styleArray =[
      {
        'featureType': 'administrative.locality',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#0049ff'
          },
          {
            'saturation': 7
          },
          {
            'lightness': 19
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'administrative.locality',
        'elementType': 'labels.text',
        'stylers': [
          {
            'visibility': 'simplified'
          },
          {
            'saturation': '-3'
          },
          {
            'color': '#ac7570'
          }
        ]
      },
      {
        'featureType': 'administrative.locality',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#fd7567'
          }
        ]
      },
      {
        'featureType': 'landscape',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#ff0000'
          },
          {
            'saturation': -100
          },
          {
            'lightness': 100
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'landscape.natural.landcover',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'landscape.natural.landcover',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'landscape.natural.terrain',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'poi',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#ffffff'
          },
          {
            'saturation': -100
          },
          {
            'lightness': 100
          },
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'poi.government',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'poi.school',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'poi.school',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#f39247'
          },
          {
            'saturation': '0'
          },
          {
            'visibility': 'on'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers': [
          {
            'hue': '#ff6f00'
          },
          {
            'saturation': '100'
          },
          {
            'lightness': 31
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'color': '#ba2317'
          },
          {
            'saturation': '0'
          },
          {
            'lightness': '-17'
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'labels',
        'stylers': [
          {
            'hue': '#008eff'
          },
          {
            'saturation': -93
          },
          {
            'lightness': 31
          },
          {
            'visibility': 'on'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'visibility': 'on'
          },
          {
            'color': '#f3dbc8'
          },
          {
            'saturation': '0'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'labels',
        'stylers': [
          {
            'hue': '#bbc0c4'
          },
          {
            'saturation': -93
          },
          {
            'lightness': -2
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'labels.text',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'road.local',
        'elementType': 'geometry',
        'stylers': [
          {
            'hue': '#007fff'
          },
          {
            'saturation': -90
          },
          {
            'lightness': -8
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road.local',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#ba2317'
          }
        ]
      },
      {
        'featureType': 'transit',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#e9ebed'
          },
          {
            'saturation': 10
          },
          {
            'lightness': 69
          },
          {
            'visibility': 'on'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#b6e5fb'
          },
          {
            'saturation': -78
          },
          {
            'lightness': 67
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#b6e5fb'
          },
          {
            'saturation': '-72'
          },
          {
            'lightness': '10'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'color': '#6496af'
          }
        ]
      }
    ];
    var minZoomLevel = 4;

    var options = {
      zoom: minZoomLevel,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      styles: styleArray,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    googleMap = new google.maps.Map(document.getElementById('map'), options);
    var bounds;
    
    if (stateView.stateCoords){
      bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(stateView.stateCoords[1], stateView.stateCoords[0]),
        new google.maps.LatLng(stateView.stateCoords[3], stateView.stateCoords[2])
      );
    } else {
      bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(20, -124.39),
        new google.maps.LatLng(49.38, -66.94)
      );
    }

    googleMap.fitBounds(bounds);
    google.maps.event.addDomListener(window, 'resize', noWebGlMapView.onResizeMap);
  };

  noWebGlMapView.onResizeMap = function() {
    google.maps.event.trigger(googleMap, 'resize');
    var mainBB = [-128.8, 23.6, -65.4, 50.2];
    var data = TownHall.allTownHalls;
    var selection = mapView.zoomLocation;
    if (selection) {
      var bounds = mapView.zoomLocation ? mapView.zoomLocation : mainBB;
      noWebGlMapView.focusMap(bounds);
    } else {
      var resizeBounds = new google.maps.LatLngBounds();
      data.forEach(function(ele){
        if (ele.lat && ele.lng) {
          var marker = new google.maps.LatLng(ele.lat, ele.lng);
          resizeBounds.extend(marker);
        }
      });
      googleMap.fitBounds(resizeBounds);
      if (googleMap.getZoom() > 12) {
        googleMap.setZoom(12);
      }
    }
  };

  // TODO; Probably redudent with resize map
  noWebGlMapView.focusMap = function(bb) {
    google.maps.event.trigger(googleMap, 'resize');
    var southWest = new google.maps.LatLng(bb[1], bb[0]);
    var northEast = new google.maps.LatLng(bb[3], bb[2]);
    var bounds = new google.maps.LatLngBounds(southWest, northEast);
    googleMap.fitBounds(bounds);
  };

  function assignMarker(iconFlag) {
    if (iconFlag === 'tele') {
      iconFlag = 'phone-in';
    }
    var path = '/Images/map/' + iconFlag + '.svg';
    return path;
  }

// Adds all events into main data array
// Adds all events as markers
// renders tables
  noWebGlMapView.setData = function (townhall){
    this.townhall.makeFormattedMember();
    var mapPopoverTemplate = Handlebars.getTemplate('mapPopover');
    TownHall.addFilterIndexes(townhall);
    $('[data-toggle="popover"]').popover({
      container: 'body',
      html:true
    });
    var coords = [townhall.lng, townhall.lat];
    var latLng = new google.maps.LatLng(coords[1], coords[0]);
    // eslint-disable-next-line no-unused-vars
    townhall.addressLink = 'https://www.google.com/maps?q=' + escape(townhall.address);
    var contentString = mapPopoverTemplate(townhall);
    var marker = new google.maps.Marker({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 0.5,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: googleMap,
      position: latLng,
      name: townhall.name,
      time: townhall.time
    });
    marker.setIcon(assignMarker(townhall.iconFlag));
    marker.addListener('click', function() {
      infowindow.setContent(contentString);
      infowindow.open(googleMap, marker);
    });
  };

  noWebGlMapView.resetMap = function() {
    if (!google.map){
      return;
    }
    setTimeout(function () {
      noWebGlMapView.onResizeMap();
    }, 50);
  };

  module.noWebGlMapView = noWebGlMapView;
}(window));
