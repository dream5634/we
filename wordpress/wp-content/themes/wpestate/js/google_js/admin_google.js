/*global admin_google_vars*/
/*global google */


var map='';
var selected_city='';
var geocoder;
var gmarkers = [];

function wpestate_initialize(){
    "use strict";
    geocoder       = new google.maps.Geocoder();
    var myPlace    = new google.maps.LatLng(admin_google_vars.general_latitude, admin_google_vars.general_longitude);
 
    var mapOptions = {
            flat:false,
            noClear:false,
            zoom: 17,
            scrollwheel: false,
            draggable: true,
            center: myPlace,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

    map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    google.maps.visualRefresh = true;

    
    var marker=new google.maps.Marker({
        position:myPlace
    });

    marker.setMap(map);
    gmarkers.push(marker);
    google.maps.event.addListener(map, 'click', function(event) {
    wpestate_placeMarker(event.latLng);
      google.maps.visualRefresh = true;
    });
    
    google.maps.event.addDomListener(document.getElementById('property_map_trigger'), 'click', function () {
     
        google.maps.event.trigger(map, 'resize');     
        map.setCenter(myPlace);
      
    });
    
   
    
    
    
    
}



function wpestate_placeMarker(location) {
    "use strict";
    wpestate_removeMarkersadmin();
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
   gmarkers.push(marker);
    var infowindow = new google.maps.InfoWindow({
        content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()  
    });
  
   infowindow.open(map,marker);
   document.getElementById("property_latitude").value=location.lat();
   document.getElementById("property_longitude").value=location.lng();
}

function wpestate_removeMarkersadmin(){
    for (i = 0; i<gmarkers.length; i++){
        gmarkers[i].setMap(null);
    }
}
 


    google.maps.event.addDomListener(window, 'load', wpestate_initialize);
 
     
    jQuery('#admin_place_pin').on('click',function(event){
        event.preventDefault();
        wpestate_admin_codeAddress();  
    });  

    jQuery('#property_citychecklist label').on('click',function(event){
       selected_city=  jQuery(this).text() ;
    }); 

 
 
 
 function wpestate_admin_codeAddress() {
    var state, city;
    var address   = document.getElementById('property_address').value;
    var full_addr= address;
  
   
    var checkedValue = jQuery('#property_city-all input:checked').parent();
    city=checkedValue.text();
 
    if(city){
        var full_addr=full_addr +','+city;
    }
    
    checkedValue = jQuery('#property_county_state-all input:checked').parent();
    state=checkedValue.text();
 
    if(state){
        var full_addr=full_addr +','+state;
    }

    var country   = document.getElementById('property_country').value;
    if(country){
         var full_addr=full_addr +','+country;
    }
  
  
 
    geocoder.geocode( { 'address': full_addr}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                wpestate_removeMarkersadmin();
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                gmarkers.push(marker);
                var infowindow = new google.maps.InfoWindow({
                    content: 'Latitude: ' + results[0].geometry.location.lat() + '<br>Longitude: ' + results[0].geometry.location.lng()  
                });

                infowindow.open(map,marker);
                document.getElementById("property_latitude").value=results[0].geometry.location.lat();
                document.getElementById("property_longitude").value=results[0].geometry.location.lng();
        } else {
                alert(admin_google_vars.geo_fails  + status);
        }
    });
}