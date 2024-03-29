/* global mapfunctions_vars,jQuery,google,googlecode_property_vars,width_browser,map ,gmarkers*/
var pin_images=mapfunctions_vars.pin_images;
var images = jQuery.parseJSON(pin_images);
var ipad_time=0;
var infobox_id=0;
var shape = {
        coord: [1, 1, 1, 38, 38, 59, 59 , 1],
        type: 'poly'
    };

var mcOptions;
var mcluster;
var clusterStyles;
var pin_hover_storage;
var first_time_wpestate_show_inpage_ajax_half=0;
var panorama;
var panorama_sh;
var infoBox_sh=null;
var user_clicked = 0;



function wpestate_map_shortcode_function(){
    "use strict";
    var selected_id         =   parseInt( jQuery('#googleMap_shortcode').attr('data-post_id'),10 );
    var curent_gview_lat    =   jQuery('#googleMap_shortcode').attr('data-cur_lat');
    var curent_gview_long   =   jQuery('#googleMap_shortcode').attr('data-cur_long');
    var zoom;

    var map2;
    var gmarkers_sh = [];
   
    if (typeof googlecode_property_vars === 'undefined') {
        zoom=5;
        heading=0;
    }else{
        zoom=googlecode_property_vars.page_custom_zoom;
        heading  = parseInt(googlecode_property_vars.camera_angle);
    }
    var mapOptions_intern = {
        flat:false,
        noClear:false,
        zoom:  parseInt(zoom),
        scrollwheel: false,
        draggable: true,
        center: new google.maps.LatLng(curent_gview_lat,curent_gview_long ),
        streetViewControl:false,
        disableDefaultUI: true,
        mapTypeId: mapfunctions_vars.type.toLowerCase(),
       // mapTypeId:'satellite'
    };

    map2                        =   new google.maps.Map(document.getElementById('googleMap_shortcode'), mapOptions_intern);
    google.maps.visualRefresh   =   true;
    width_browser               =   jQuery(window).width();
    var boxText                 =   document.createElement("div");
 
    var myOptions = {
        content: boxText,
        disableAutoPan: true,
        maxWidth: 500,
        boxClass:"mybox",
        zIndex: null,			
        closeBoxMargin: "-13px 0px 0px 0px",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: true                   
    };              
    infoBox_sh = new InfoBox(myOptions);    
    
    
    if(mapfunctions_vars.map_style !==''){
        var styles = JSON.parse ( mapfunctions_vars.map_style );
        map2.setOptions({styles: styles});
    }
    
    var id                    = selected_id;
    var lat                   = curent_gview_lat;
    var lng                   = curent_gview_long;
    var title                 = decodeURIComponent ( jQuery('#googleMap_shortcode').attr('data-title') ); 
    var pin                   = jQuery('#googleMap_shortcode').attr('data-pin');
    var counter               = 1;
    var image                 = decodeURIComponent ( jQuery('#googleMap_shortcode').attr('data-thumb' ));
    var price                 = decodeURIComponent ( jQuery('#googleMap_shortcode').attr('data-price' ));
    var single_first_type           = decodeURIComponent ( jQuery('#googleMap_shortcode').attr('data-single-first-type') );        
    var single_first_action         = decodeURIComponent ( jQuery('#googleMap_shortcode').attr('data-single-first-action') );
    var link                        = decodeURIComponent ( jQuery('#googleMap_shortcode').attr('data-prop_url' ));
    var city                        = '';
    var area                        = '';
    var cleanprice                  = '';
    var rooms                       = jQuery('#googleMap_shortcode').attr('data-rooms') ;
    var baths                       =   jQuery('#googleMap_shortcode').attr('data-bathrooms') ;
    var size                        =   jQuery('#googleMap_shortcode').attr('data-size') ;
    var single_first_type_name      =   decodeURIComponent ( jQuery('#googleMap_shortcode').attr('data-single-first-type') );  
    var single_first_action_name    =   decodeURIComponent ( jQuery('#googleMap_shortcode').attr('data-single-first-action') );
    var agent_id                    =   '' ;   
    var county_state                =   '' ;  
    var i = 1;
            
              
  
    wpestate_createMarker_sh (infoBox_sh,gmarkers_sh,map2,county_state, size, i,id,lat,lng,pin,title,counter,image,price,single_first_type,single_first_action,link,city,area,rooms,baths,cleanprice,single_first_type_name, single_first_action_name );
  
    
    
    var viewPlace   =   new google.maps.LatLng(curent_gview_lat,curent_gview_long);
    panorama_sh        =   map2.getStreetView();
    panorama_sh.setPosition(viewPlace);


    panorama_sh.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: heading,
        pitch: 0
    }));
    
    jQuery('#slider_enable_street_sh').on('click',function(){
        
        cur_lat     =   jQuery('#googleMap_shortcode').attr('data-cur_lat');
        cur_long    =   jQuery('#googleMap_shortcode').attr('data-cur_long');
        myLatLng    =   new google.maps.LatLng(cur_lat,cur_long);
      
        panorama_sh.setPosition(myLatLng);
        panorama_sh.setVisible(true); 
        jQuery('#gmapzoomminus_sh,#gmapzoomplus_sh,#slider_enable_street_sh').hide();
     
    });
    
    google.maps.event.addListener(panorama_sh, "closeclick", function() {
     
        jQuery('#gmapzoomminus_sh,#gmapzoomplus_sh,#slider_enable_street_sh').show();
    });
    
    
    
    
    if(  document.getElementById('gmapzoomplus_sh') ){
        google.maps.event.addDomListener(document.getElementById('gmapzoomplus_sh'), 'click', function () {    
        
            var current= parseInt( map2.getZoom(),10);
            current++;
            if(current>20){
                current=20;
            }
            map2.setZoom(current);
        });  
    }
    
    
    if(  document.getElementById('gmapzoomminus_sh') ){
        google.maps.event.addDomListener(document.getElementById('gmapzoomminus_sh'), 'click', function () {    
        
            var current= parseInt( map2.getZoom(),10);
            current--;
            if(current<0){
                current=0;
            }
            map2.setZoom(current);
        });  
    }
  

    google.maps.event.trigger(gmarkers_sh[0], 'click');  
    google.maps.event.trigger(map2, 'resize');
}





function wpestate_createMarker_sh (infoBox_sh,gmarkers_sh,map2,county_state, size, i,id,lat,lng,pin,title,counter,image,price,single_first_type,single_first_action,link,city,area,rooms,baths,cleanprice,single_first_type_name, single_first_action_name ){
  
   "use strict";
    
    var new_title       =   '';
    var myLatLng        =   new google.maps.LatLng(lat,lng);
    var infobox_class   =   "";
    if(mapfunctions_vars.useprice === 'yes'){

        var myLatLng = new google.maps.LatLng(lat,lng);
        var Titlex = jQuery('<textarea />').html(title).text();
        var myLatlng = new google.maps.LatLng(lat,lng);
        var infoWindowIndex = 999;
        var poss=11;
        marker= new WpstateMarker(
            poss,
            myLatlng, 
            map2, 
            Titlex,
            counter,
            image,
            id,
            price,
            single_first_type,
            single_first_action,
            link,
            i,
            rooms,
            baths,
            cleanprice,
            size,
            single_first_type_name,
            single_first_action_name,
            pin,
            infoWindowIndex
        );
        
    
    }else{
       infobox_class=" classic_info ";
        var marker = new google.maps.Marker({
           position: myLatLng,
           map: map2,
           icon: wpestate_custompin(pin),
           shape: shape,
           title: title,
           zIndex: counter,
           image:image,
           idul:id,
           price:price,
           category:single_first_type,
           action:single_first_action,
           link:link,
           city:city,
           area:area,
           infoWindowIndex : i,
           rooms:rooms,
           baths:baths,
           cleanprice:cleanprice,
           size:size,
           county_state:county_state,
           category_name:single_first_type_name,
           action_name:single_first_action_name,
           
        });             
    }

   

    gmarkers_sh.push(marker);
    



    google.maps.event.addListener(marker, 'click', function(event) {
        
        if(this.image===''){
            info_image='<img src="' + mapfunctions_vars.path + '/idxdefault.jpg" />';
        }else{
            info_image=this.image;
        }

        var category         =   decodeURIComponent ( this.category.replace(/-/g,' ') );
        var action           =   decodeURIComponent ( this.action.replace(/-/g,' ') );
        var category_name    =   decodeURIComponent ( this.category_name.replace(/-/g,' ') );
        var action_name      =   decodeURIComponent ( this.action_name.replace(/-/g,' ') );
        var in_type          =   mapfunctions_vars.in_text;
        if(category==='' || action===''){
            in_type=" ";
        }


        var infobaths; 
        if(this.baths!=''){
            infobaths ='<span id="infobath">'+this.baths+'<div class="info_labels">'+ mapfunctions_vars.baths +'</div></span>';
        }else{
            infobaths =''; 
        }

        var inforooms;
        if(this.rooms!=''){
            inforooms='<span id="inforoom">'+this.rooms+'<div class="info_labels">'+ mapfunctions_vars.beds +'</div></span>';
        }else{
            inforooms=''; 
        }

        var infosize;
        if(this.size!=''){
            infosize ='<span id="infosize">'+this.size;
            if(mapfunctions_vars.measure_sys==='ft'){
                infosize = infosize+ ' ft<sup>2</sup>';
            }else{
                infosize = infosize+' m<sup>2</sup>';
            }
            infosize =infosize+'<div class="info_labels">'+ mapfunctions_vars.size +'</div></span>';
        }else{
            infosize=''; 
        }


        var title=  this.title.substr(0, 45);
        if(this.title.length > 45){
            title=title+"...";
        }
        var title=  marker.title;
        var long_title_class='';
        if(marker.title.length > 28){
            long_title_class=" long_title ";
        }
        infoBox_sh.setContent('<div class="info_details '+infobox_class+long_title_class+' "><span id="infocloser" onClick=\'javascript:infoBox_sh.close();\' ><i class="demo-icon icon-cancel" aria-hidden="true"></i></span><div class="infobox_image_wrapper"><a href="'+this.link+'">'+info_image+'</a></div><div class="infobox_details_wrapper"><a href="'+this.link+'" id="infobox_title">'+title+'</a><div class="prop_detailsx">'+category_name+" "+in_type+" "+action_name+'</div><div class="prop_pricex">'+this.price+'</div><div class="infobox_listing_details">'+inforooms+infobaths+infosize+'</div></div></div>');

        infoBox_sh.open(map2, this);    
        map2.setCenter(this.position);
        
         
        var width_browser       =   jQuery(window).width(); 
    
        var infobox_width=700;
        if (width_browser<600){
            infobox_width=600;
        }


        switch (infobox_width){
        case 700:
            map2.panBy(250,-80);
            break;
        break;
        case 600: 
           
            if(mapfunctions_vars.useprice === 'yes'){
                map2.panBy(0,-120);
            }else{
                map2.panBy(80,-30);
                
            }
            break;
        }

           
     

  });/////////////////////////////////// end event listener
            
    
  
        
}



/////////////////////////////////////////////////////////////////////////////////////////////////
// change map
/////////////////////////////////////////////////////////////////////////////////////////////////  

function  wpestate_change_map_type(map_type){
  "use strict";
    if(map_type==='map-view-roadmap'){
         map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }else if(map_type==='map-view-satellite'){
         map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    }else if(map_type==='map-view-hybrid'){
         map.setMapTypeId(google.maps.MapTypeId.HYBRID);
    }else if(map_type==='map-view-terrain'){
         map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    }
   
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//  set markers... loading pins over map
/////////////////////////////////////////////////////////////////////////////////////////////////  

function wpestate_setMarkers(map, locations, with_bound) {
  
    "use strict";
    var map_open;          
     
    var myLatLng;
    var selected_id     =   parseInt( jQuery('#gmap_wrapper').attr('data-post_id') );
    if( isNaN(selected_id) ){
        selected_id     =   parseInt( jQuery('#googleMapSlider').attr('data-post_id'),10 );
    }
   
    var open_height     =   parseInt(mapfunctions_vars.open_height,10);
    var closed_height   =   parseInt(mapfunctions_vars.closed_height,10);
    var boxText         =   document.createElement("div");
    width_browser       =   jQuery(window).width();
    
    infobox_width=700;
    vertical_pan=-215;
    if (width_browser<900){
      infobox_width=500;
    }
    if (width_browser<600){
      infobox_width=400;
    }
    if (width_browser<400){
      infobox_width=200;
    }
 
 
    var myOptions = {
        content: boxText,
        disableAutoPan: true,
        maxWidth: infobox_width,
        boxClass:"mybox",
        zIndex: null,			
        closeBoxMargin: "-13px 0px 0px 0px",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: true                   
    };              
    infoBox = new InfoBox(myOptions);         
                                
    bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < locations.length; i++) {
        var beach                 = locations[i];
        var id                    = beach[10];
        var lat                   = beach[1];
        var lng                   = beach[2];
        var title                 = decodeURIComponent ( beach[0] );
        var pin                   = beach[8];
        var counter               = beach[3];
        var image                 = decodeURIComponent ( beach[4] );
        var price                 = decodeURIComponent ( beach[5] );
        var single_first_type     = decodeURIComponent ( beach[6] );          
        var single_first_action   = decodeURIComponent ( beach[7] );
        var link                  = decodeURIComponent ( beach[9] );
     
        var cleanprice            = beach[11];
        var rooms                 = beach[12];
        var baths                 = beach[13];
        var size                  = beach[14];
        var single_first_type_name      =   decodeURIComponent ( beach[15] );
        var single_first_action_name    =   decodeURIComponent ( beach[16] );
      
           
        wpestate_createMarker ( size, i,id,lat,lng,pin,title,counter,image,price,single_first_type,single_first_action,link,rooms,baths,cleanprice,single_first_type_name, single_first_action_name);
      
  
  
        // found the property
        if(selected_id===id){
            found_id=i;
        }
       
      
    }//end for

  
    map_cluster();
    if( !jQuery('body').hasClass('single-estate_property') ){
        oms = new OverlappingMarkerSpiderfier(map, 
            {
                markersWontMove: true, 
                markersWontHide: true,
                keepSpiderfied :true,
                legWeight:3
            });
        wpestate_setOms(gmarkers);
    }

    if(with_bound===1){
        if (!bounds.isEmpty()) {
          
            wpestate_fit_bounds(bounds);
        }else{
            wpestate_fit_bounds_nolsit();
        }
    }          
    
    // pan to the latest pin for taxonmy and adv search  
    if(mapfunctions_vars.generated_pins!=='0'){
        myLatLng  = new google.maps.LatLng(lat, lng);
    }
    
 
   
   
}// end setMarkers


/////////////////////////////////////////////////////////////////////////////////////////////////
//  create marker
/////////////////////////////////////////////////////////////////////////////////////////////////  

function   wpestate_createMarker ( size, i,id,lat,lng,pin,title,counter,image,price,single_first_type,single_first_action,link,rooms,baths,cleanprice,single_first_type_name, single_first_action_name){
        

    var myLatLng = new google.maps.LatLng(lat,lng);
    var Titlex = jQuery('<textarea />').html(title).text();
    var infobox_class="";
    var poss=0;
    if(mapfunctions_vars.useprice === 'yes'){
	var myLatlng = new google.maps.LatLng(lat,lng);
        marker= new WpstateMarker( 
            poss,
            myLatlng, 
            map, 
            Titlex,
            counter,
            image,
            id,
            price,
            single_first_type,
            single_first_action,
            link,
            i,
            rooms,
            baths,
            cleanprice,
            size,
            single_first_type_name,
            single_first_action_name,
            pin,
            i
        );
    }else{
        infobox_class=" classic_info ";
        var marker = new google.maps.Marker({
            position:           myLatLng,
            map:                map,
            icon:               wpestate_custompin(pin),
            shape:              shape,
            title:              Titlex,
            zIndex:             counter,
            image:              image,
            idul:               id,
            price:              price,
            category:           single_first_type,
            action:             single_first_action,
            link:               link,
            infoWindowIndex :   i,
            rooms:              rooms,
            baths:              baths,
            cleanprice:         cleanprice,
            size:               size,
            category_name:      single_first_type_name,
            action_name:        single_first_action_name
        });
    }
    
   
    gmarkers.push(marker);
    bounds.extend(marker.getPosition());
    google.maps.event.addListener(marker, 'click', function(event) {
        wpestate_open_infobox(this,infobox_class);
        map.setCenter(this.position);
        wpestate_map_pan();
    });
            
         
        
}



function wpestate_map_pan(){
 "use strict";
    width_browser       =   jQuery(window).width(); 
    
    infobox_width=700;
    if (width_browser<600){
        infobox_width=600;
    };
    
    
    switch (infobox_width){
        case 700:
            map.panBy(250,-80);
            break;
        break;
        case 600: 
            if(mapfunctions_vars.useprice === 'yes'){
                map.panBy(0,-120);
            }else{
                map.panBy(80,-30);
            }
            break;
        }
}


function wpestate_open_infobox(marker,infobox_class){
     "use strict";
    if( infoBox!== null){
        infoBox.close(); 
    }

    google.maps.event.trigger(map, 'resize');

    if(marker.image===''){
        info_image='<img src="' + mapfunctions_vars.path + '/idxdefault.jpg"  />';
    }else{
        info_image=marker.image;
    }

    var category         =   decodeURIComponent ( marker.category.replace(/-/g,' ') );
    var action           =   decodeURIComponent ( marker.action.replace(/-/g,' ') );
    var category_name    =   decodeURIComponent ( marker.category_name.replace(/-/g,' ') );
    var action_name      =   decodeURIComponent ( marker.action_name.replace(/-/g,' ') );
    var in_type          =   mapfunctions_vars.in_text;
    if(category==='' || action===''){
        in_type=" ";
    }

    var infobaths; 
    if(marker.baths!=''){
        infobaths ='<span id="infobath">'+marker.baths+'<div class="info_labels">'+ mapfunctions_vars.baths +'</div></span>';
    }else{
        infobaths =''; 
    }

    var inforooms;
    if(marker.rooms!=''){
        inforooms='<span id="inforoom">'+marker.rooms+'<div class="info_labels">'+ mapfunctions_vars.beds +'</div></span>';
    }else{
        inforooms=''; 
    }

    var infosize;
    if(marker.size!=''){
        infosize ='<span id="infosize">'+marker.size;
        if(mapfunctions_vars.measure_sys==='ft'){
            infosize = infosize+ ' ft<sup>2</sup>';
        }else{
            infosize = infosize+' m<sup>2</sup>';
        }
        infosize =infosize+'<div class="info_labels">'+ mapfunctions_vars.size +'</div></span>';
    }else{
        infosize=''; 
    }


    var title=  marker.title;
    var long_title_class='';
    if(marker.title.length > 28){
        long_title_class=" long_title ";
    }



    infoBox.setContent('<div class="info_details '+infobox_class+long_title_class+'"><span id="infocloser" onClick=\'javascript:infoBox.close();\'><i class="demo-icon icon-cancel" aria-hidden="true"></i></span><div class="infobox_image_wrapper"><a href="'+marker.link+'">'+info_image+'</a></div><div class="infobox_details_wrapper"><a href="'+marker.link+'" id="infobox_title">'+title+'</a><div class="prop_detailsx">'+category_name+" "+in_type+" "+action_name+'</div><div class="prop_pricex">'+marker.price+'</div><div class="infobox_listing_details">'+inforooms+infobaths+infosize+'</div></div></div>');
    infoBox.open(map, marker); 
}


function  wpestate_pan_to_last_pin(myLatLng){
     "use strict";
    map.setCenter(myLatLng);   
}




/////////////////////////////////////////////////////////////////////////////////////////////////
//  map set search
/////////////////////////////////////////////////////////////////////////////////////////////////  
function wpestate_setOms(gmarkers){
     "use strict";
    for (var i = 0; i < gmarkers.length; i++) {
        if(typeof oms !== 'undefined'){
           oms.addMarker(gmarkers[i]);
        }else{
      
        }
    }
    
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//  map set search
/////////////////////////////////////////////////////////////////////////////////////////////////  

function wpestate_set_google_search(map){
     "use strict";
    var input,searchBox,places;
    
    input = (document.getElementById('google-default-search'));
    searchBox = new google.maps.places.SearchBox(input);
    
   
    google.maps.event.addListener(searchBox, 'places_changed', function() {
    places = searchBox.getPlaces();
        
        if (places.length == 0) {
          return;
        }
        
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          position: place.geometry.location
        });

        gmarkers.push(marker);

        bounds.extend(place.geometry.location);
    
    }

    map.fitBounds(bounds);
    if (!bounds.isEmpty()) {
        wpestate_fit_bounds(bounds);
    }else{
        wpestate_fit_bounds_nolsit();
    }
    map.setZoom(15);
  });

  
    google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
    
}

function wpestate_fit_bounds_nolsit(){
     "use strict";
    map.setZoom(3);       
}



function wpestate_fit_bounds(bounds){
 "use strict";
    map.fitBounds(bounds);
    google.maps.event.addListenerOnce(map, 'idle', function() {
        if( map.getZoom()>15 ) {
            map.setZoom(15);
        }
    });
  
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//  open close map
/////////////////////////////////////////////////////////////////////////////////////////////////  

function wpestate_new_open_close_map(type){
     "use strict";
    if( jQuery('#gmap_wrapper').hasClass('fullmap') ){
        return;
    }
    
    if(mapfunctions_vars.open_close_status !== '1'){ // we can resize map
        
        var current_height  =   jQuery('#googleMap').outerHeight();
        var closed_height   =   parseInt(mapfunctions_vars.closed_height,10);
        var open_height     =   parseInt(mapfunctions_vars.open_height,10);
        var googleMap_h     =   open_height;
        var gmapWrapper_h   =   open_height;
          
        if( infoBox!== null){
            infoBox.close(); 
        }
     
        if ( current_height === closed_height )  {                       
            googleMap_h = open_height;                                
            if (Modernizr.mq('only all and (max-width: 940px)')) {
               gmapWrapper_h = open_height;
            } else {
                jQuery('#gmap-menu').show(); 
                gmapWrapper_h = open_height;
            }
        
            wpestate_new_show_advanced_search();
            vertical_off=0;
        

        } else if(type===2) {
            jQuery('#gmap-menu').hide();
            jQuery('#advanced_search_map_form').hide();
            googleMap_h = gmapWrapper_h = closed_height;
           
            // hide_advanced_search();
            wpestate_new_hide_advanced_search();
            vertical_off=150;           
        }
        jQuery('#gmap_wrapper').css('height', gmapWrapper_h+'px');
        jQuery('#googleMap').css('height', googleMap_h+'px');
        jQuery('.tooltip').fadeOut("fast");
        
        
        setTimeout(function(){google.maps.event.trigger(map, "resize"); }, 300);
    }
}





/////////////////////////////////////////////////////////////////////////////////////////////////
//  build map cluter
/////////////////////////////////////////////////////////////////////////////////////////////////   
  function map_cluster(){    
 "use strict";
       if(mapfunctions_vars.user_cluster==='yes'){
 
        clusterStyles = [
            {
            textColor: '#ffffff',    
            opt_textColor: '#ffffff',
            url: mapfunctions_vars.path+'/cloud.png',
            height: 72,
            width: 72,
            textSize:16,
           
            }
        ];
        mcOptions = {gridSize: 50,
                    ignoreHidden:true, 
                    maxZoom: parseInt( mapfunctions_vars.zoom_cluster,10), 
                    styles: clusterStyles
                };
        mcluster = new MarkerClusterer(map, gmarkers, mcOptions);
        mcluster.setIgnoreHidden(true);
    }
   
  }  
    
    
      
/////////////////////////////////////////////////////////////////////////////////////////////////
/// zoom
/////////////////////////////////////////////////////////////////////////////////////////////////
  
    
if(  document.getElementById('gmapzoomplus') ){
     google.maps.event.addDomListener(document.getElementById('gmapzoomplus'), 'click', function () { 
          "use strict";
       var current= parseInt( map.getZoom(),10);
       current++;
       if(current>20){
           current=20;
       }
       map.setZoom(current);
       jQuery("#slider_zoom_map").slider('value',current);
    });  
}
    
    
if(  document.getElementById('gmapzoomminus') ){
     google.maps.event.addDomListener(document.getElementById('gmapzoomminus'), 'click', function () { 
          "use strict";
       var current= parseInt( map.getZoom(),10);
       current--;
       if(current<0){
           current=0;
       }
       map.setZoom(current);
       jQuery("#slider_zoom_map").slider('value',current);
    });  
}
        
    
    
/////////////////////////////////////////////////////////////////////////////////////////////////
/// geolocation
/////////////////////////////////////////////////////////////////////////////////////////////////

if(  document.getElementById('geolocation-button') ){
    google.maps.event.addDomListener(document.getElementById('geolocation-button'), 'click', function () {  
         "use strict";
        wpestate_myposition(map);
        wpestate_close_adv_search();
    });  
}


if(  document.getElementById('mobile-geolocation-button') ){
    google.maps.event.addDomListener(document.getElementById('mobile-geolocation-button'), 'click', function () { 
         "use strict";
         wpestate_myposition(map);
         wpestate_close_adv_search();
    });  
}





function wpestate_myposition(map){    
     "use strict";
    if(navigator.geolocation){
        var latLong;
        if (location.protocol === 'https:') {
            navigator.geolocation.getCurrentPosition(wpestate_showMyPosition_original,wpestate_position_errorCallback,{timeout:10000});
        }else{
            jQuery.getJSON("http://ipinfo.io", function(ipinfo){
                latLong = ipinfo.loc.split(",");
                wpestate_showMyPosition (latLong);
            });
        }
      
    }else{
        alert(mapfunctions_vars.geo_no_brow);
    }
}


function wpestate_position_errorCallback(){
     "use strict";
    alert(mapfunctions_vars.geo_no_pos);
}




function wpestate_showMyPosition_original(pos){
    "use strict";
    var shape = {
       coord: [1, 1, 1, 38, 38, 59, 59 , 1],
       type: 'poly'
   }; 
   
   var MyPoint=  new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude);
   map.setCenter(MyPoint);   
   
   var marker = new google.maps.Marker({
             position: MyPoint,
             map: map,
             icon: wpestate_custompinchild(),
             shape: shape,
             title: '',
             zIndex: 999999999,
             image:'',
             price:'',
             category:'',
             action:'',
             link:'' ,
             infoWindowIndex : 99 ,
             radius: parseInt(mapfunctions_vars.geolocation_radius,10)+' '+mapfunctions_vars.geo_message
            });
    
     var populationOptions = {
      strokeColor: '#67cfd8',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#67cfd8',
      fillOpacity: 0.2,
      map: map,
      center: MyPoint,
      radius: parseInt(mapfunctions_vars.geolocation_radius,10)
    };
    var cityCircle = new google.maps.Circle(populationOptions);
    
        var label = new Label({
          map: map
        });
        label.bindTo('position', marker);
        label.bindTo('text', marker, 'radius');
        label.bindTo('visible', marker);
        label.bindTo('clickable', marker);
        label.bindTo('zIndex', marker);

}
    
    
var geo_markers =   [];
var geo_circle  =   [];
var geo_label   =   [];

function wpestate_showMyPosition(pos){
    "use strict";
    for (var i = 0; i < geo_markers.length; i++) {
        geo_markers[i].setMap(null);
        geo_circle[i].setMap(null);
        geo_label[i].setMap(null);
    }
    
    geo_markers =   [];  
    geo_circle  =   [];
    geo_label   =   [];
    
    
    var shape = {
        coord: [1, 1, 1, 38, 38, 59, 59 , 1],
        type: 'poly'
    }; 
   
    // var MyPoint=  new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude);
   
    var MyPoint=  new google.maps.LatLng( pos[0], pos[1]);
    map.setCenter(MyPoint);   
    map.setZoom(13);
    var marker = new google.maps.Marker({
            position: MyPoint,
            map: map,
            icon: wpestate_custompinchild(),
            shape: shape,
            title: '',
            zIndex: 999999999,
            image:'',
            price:'',
            category:'',
            action:'',
            link:'' ,
            infoWindowIndex : 99 ,
            radius: parseInt(mapfunctions_vars.geolocation_radius,10)+' '+mapfunctions_vars.geo_message
            });
    geo_markers.push(marker);
    
    
    var populationOptions = {
        strokeColor: '#67cfd8',
        strokeOpacity: 0.6,
        strokeWeight: 1,
        fillColor: '#67cfd8',
        fillOpacity: 0.2,
        map: map,
        center: MyPoint,
        radius: parseInt(mapfunctions_vars.geolocation_radius,10)
    };
    
    
    
    var cityCircle = new google.maps.Circle(populationOptions);
    geo_circle.push(cityCircle);
    
    var label = new Label({
        map: map
    });
        
    label.bindTo('position', marker);
    label.bindTo('text', marker, 'radius');
    label.bindTo('visible', marker);
    label.bindTo('clickable', marker);
    label.bindTo('zIndex', marker);
    geo_label.push(cityCircle);
}
    
    
    
function wpestate_custompinchild(){
    "use strict";

    var custom_img;
    var extension='';
    var ratio = jQuery(window).dense('devicePixelRatio');
    
    if(ratio>1){
        extension='_2x';
    }
    
    
    if( typeof( images['userpin'] )=== 'undefined' ||  images['userpin']===''){
        custom_img= mapfunctions_vars.path+'/'+'userpin'+extension+'.png';     
    }else{
        custom_img=images['userpin'];
        if(ratio>1){
            custom_img=custom_img.replace(".png","_2x.png");
        }
    }
   
   
    
    
    
    if(ratio>1){
         
        var   image = {
            url: custom_img, 
            size: new google.maps.Size(88, 96),
            scaledSize   :  new google.maps.Size(44, 48),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(16,59 )
        };
     
    }else{
       var   image = {
            url: custom_img, 
            size: new google.maps.Size(59, 59),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(16,59 )
        };
    }
    
    
    return image;
  
}




/////////////////////////////////////////////////////////////////////////////////////////////////
/// 
/////////////////////////////////////////////////////////////////////////////////////////////////

if( document.getElementById('gmap') ){
    google.maps.event.addDomListener(document.getElementById('gmap'), 'mouseout', function () {   
         "use strict";
        google.maps.event.trigger(map, "resize");
    });  
}     


if(  document.getElementById('search_map_button') ){
    google.maps.event.addDomListener(document.getElementById('search_map_button'), 'click', function () {  
         "use strict";
        infoBox.close();
    });  
}



if(  document.getElementById('advanced_search_map_button') ){
    google.maps.event.addDomListener(document.getElementById('advanced_search_map_button'), 'click', function () {  
         "use strict";
       infoBox.close();
    }); 
}
 
////////////////////////////////////////////////////////////////////////////////////////////////
/// navigate troguh pins 
///////////////////////////////////////////////////////////////////////////////////////////////

jQuery('#gmap-next').on('click',function(){
    current_place++;  
    if (current_place>gmarkers.length){
        current_place=1;
    }
    while(gmarkers[current_place-1].visible===false){
        current_place++; 
        if (current_place>gmarkers.length){
            current_place=1;
        }
    }
    
    if( map.getZoom() <15 ){
        map.setZoom(15);
    }
    google.maps.event.trigger(gmarkers[current_place-1], 'click');
   
});


jQuery('#gmap-prev').on('click',function(){
    current_place--;
    if (current_place<1){
        current_place=gmarkers.length;
    }
    while(gmarkers[current_place-1].visible===false){
        current_place--; 
        if (current_place>gmarkers.length){
            current_place=1;
        }
    }
    if( map.getZoom() <15 ){
        map.setZoom(15);
    }
    google.maps.event.trigger(gmarkers[current_place-1], 'click');
  
});








///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// filter pins 
//////////////////////////////////////////////////////////////////////////////////////////////////////////

jQuery('.advanced_action_div li').on('click',function(){
   var action = jQuery(this).val();
});





if(  document.getElementById('gmap-menu') ){
    google.maps.event.addDomListener(document.getElementById('gmap-menu'), 'click', function (event) {
         "use strict";
        infoBox.close();

        if (event.target.nodeName==='INPUT'){
            category=event.target.className; 

                if(event.target.name==="filter_action[]"){            
                    if(actions.indexOf(category)!==-1){
                        actions.splice(actions.indexOf(category),1);
                    }else{
                        actions.push(category);
                    }
                }

                if(event.target.name==="filter_type[]"){            
                    if(categories.indexOf(category)!==-1){
                        categories.splice(categories.indexOf(category),1);
                    }else{
                        categories.push(category);
                    }
                }

          show(actions,categories);
        }

    }); 
}
 



function wpestate_get_custom_value_tab_search(slug){
 "use strict";
    var value='';
    var is_drop=0;
    if(slug === 'adv_categ' || slug === 'adv_actions' ||  slug === 'advanced_city' ||  slug === 'advanced_area'  ||  slug === 'county-state'){     
        value = jQuery('.tab-pane.active #'+slug).attr('data-value');
    } else if(slug === 'property_price' && mapfunctions_vars.slider_price==='yes'){
        value = jQuery('.tab-pane.active #price_low').val();
    }else if(slug === 'property-country'){
        value = jQuery('.tab-pane.active #advanced_country').attr('data-value');
    }else{
  
        if(slug!==''){
            if( jQuery('.tab-pane.active #'+slug).hasClass('filter_menu_trigger') ){ 
                value = jQuery('.tab-pane.active #'+slug).attr('data-value');
                is_drop=1;
            }else{
                value = jQuery('.tab-pane.active #'+slug).val() ;
            }
        }
    }
    
    return value;
 
}
  
  
function wpestate_get_custom_value(slug){
    /*ok*/
    var value;
    var is_drop=0;
    if(slug === 'adv_categ' || slug === 'adv_actions' ||  slug === 'advanced_city' ||  slug === 'advanced_area'  ||  slug === 'county-state'){     
        value = jQuery('#'+slug).attr('data-value');
    } else if(slug === 'property_price' && mapfunctions_vars.slider_price==='yes'){
        value = jQuery('#price_low').val();
    }else if(slug === 'property-country'){
        value = jQuery('#advanced_country').attr('data-value');
    }else{
      
        if( jQuery('#'+slug).hasClass('filter_menu_trigger') ){ 
            value = jQuery('#'+slug).attr('data-value');
            is_drop=1;
        }else{
            value = jQuery('#'+slug).val() ;
            
        }
    }
    
  
    if (typeof(value)!=='undefined'&& is_drop===0){
      //  value=  value .replace(" ","-");
    }
    
    return value;
 
}
  


function wpestate_get_custom_value_onthelist(slug){
    "use strict";
    var value;
    var is_drop=0;
    if(slug === 'adv_categ' || slug === 'adv_actions' ||  slug === 'advanced_city' ||  slug === 'advanced_area'  ||  slug === 'county-state'){     
        value = jQuery('#'+slug).attr('data-value');
        if( slug === 'adv_categ'){
            value =  jQuery('#tax_categ_picked').val();
        }else  if( slug === 'adv_actions'){
            value = jQuery('#tax_action_picked').val();
        }else if( slug === 'advanced_city'){
            value =  jQuery('#tax_city_picked').val();
        }else if( slug === 'advanced_area'){
            value = jQuery('#taxa_area_picked').val();   
        }
         
         
         
    } else if(slug === 'property_price' && mapfunctions_vars.slider_price==='yes'){
        value = jQuery('#price_low').val();
    }else if(slug === 'property-country'){
        value = jQuery('#advanced_country').attr('data-value');
    }else{
      
        if( jQuery('#'+slug).hasClass('filter_menu_trigger') ){ 
            value = jQuery('#'+slug).attr('data-value');
            is_drop=1;
        }else{
            value = jQuery('#'+slug).val() ;
        }
    }
    
    return value;
}
    
  

 
function wpestate_show_pins_onthelist() {
    "use strict";
    //obosolite

    return;
}
 
function wpestate_show_pins_custom_search_onthelist(){
     "use strict";
    var array_last_item,slug_holder,how_holder,val_holder ,temp_val, position,inserted_val;
    //obsolote
    return;
}  
 
 
 function wpestate_show_pins() {
     
    "use strict";
    var action, category, city, area, rooms, baths, min_price, price_max, ajaxurl,postid,halfmap, all_checkers,newpage;
     
    if(  typeof infoBox!=='undefined' && infoBox!== null ){
        infoBox.close(); 
    }
 
    jQuery('#gmap-loading').show();
    

    //- removed &&  googlecode_regular_vars.is_adv_search!=='1'
    if( typeof googlecode_regular_vars !== 'undefined' || typeof googlecode_property_vars!=='undefined' ){
        
        if( (mapfunctions_vars.adv_search_type==='8' || mapfunctions_vars.adv_search_type==='9') &&  googlecode_regular_vars.is_half_map_list!=='1'   ){
            wpestate_show_pins_type2_tabs();
            return;
        }

        if(typeof googlecode_regular_vars !== 'undefined' ){
            if(mapfunctions_vars.adv_search_type==='2' &&  googlecode_regular_vars.is_half_map_list!=='1' &&  googlecode_regular_vars.is_adv_search!=='1'){
                wpestate_show_pins_type2();
                return;
            }
        }
        if(typeof googlecode_property_vars !== 'undefined' || mapfunctions_vars.adv_search_type==='2' ){
            wpestate_show_pins_type2();
            return;
            
        }

    }
    
    
    if(mapfunctions_vars.custom_search==='yes'){
       wpestate_show_pins_custom_search();
       return;
    }    

    
  
    action      =   jQuery('#adv_actions').attr('data-value');
    category    =   jQuery('#adv_categ').attr('data-value');
    city        =   jQuery('#advanced_city').attr('data-value');
    area        =   jQuery('#advanced_area').attr('data-value');
    rooms       =   parseFloat(jQuery('#adv_rooms').val(), 10);
    baths       =   parseFloat(jQuery('#adv_bath').val(), 10);
    min_price   =   parseFloat(jQuery('#price_low').val(), 10);
    price_max   =   parseFloat(jQuery('#price_max').val(), 10);
    postid      =   parseFloat(jQuery('#adv-search-1').attr('data-postid'), 10);
    ajaxurl     =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
     
     
    if ( parseInt(mapfunctions_vars.is_half)===1 ){
        if(first_time_wpestate_show_inpage_ajax_half===0){
            first_time_wpestate_show_inpage_ajax_half=1
        }else{
          
            wpestate_show_inpage_ajax_half();
        }
     
    } 
     
    all_checkers = '';
    jQuery('.extended_search_check_wrapper  input[type="checkbox"]').each(function () {
         "use strict";
        if (jQuery(this).is(":checked")) {
            all_checkers = all_checkers + "," + jQuery(this).attr("name");
        }
    });
    
    halfmap     =   0;
    newpage     =   0;
    if( jQuery('#google_map_prop_list_sidebar').length ){
        halfmap    = 1;
    }   
  
    postid=1;
    if(  document.getElementById('search_wrapper') ){
        postid      =   parseInt(jQuery('#search_wrapper').attr('data-postid'), 10);
    }
    var nonce = jQuery('#wpestate_ajax_filter_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        dataType: 'json',
        data: {
            'action'            :   'wpestate_classic_ondemand_pin_load',
            'action_values'     :   action,
            'category_values'   :   category,
            'city'              :   city,
            'area'              :   area,
            'advanced_rooms'    :   rooms,
            'advanced_bath'     :   baths,
            'price_low'         :   min_price,
            'price_max'         :   price_max,
            'newpage'           :   newpage,
            'postid'            :   postid,
            'halfmap'           :   halfmap,
            'all_checkers'      :   all_checkers,
            'security'          :   nonce,
        },
        success: function (data) { 
            var no_results = parseInt(data.no_results);
            
            if(no_results!==0){
                wpestate_load_on_demand_pins(data.markers,no_results,1);
            }else{
                wpestate_show_no_results();
            }
               jQuery('#gmap-loading').hide();
          
        },
        error: function (errorThrown) {
          
        }
    });//end ajax     
    
 }
 
 
 
 
 
 function wpestate_show_pins_type2(){
 "use strict";
    var action, category, location_search, ajaxurl,postid,halfmap, all_checkers,newpage;
    
    action      =   jQuery('#adv_actions').attr('data-value');
    category    =   jQuery('#adv_categ').attr('data-value');
    location_search    =   jQuery('#adv_location').val();
    postid      =   parseInt(jQuery('#adv-search-1').attr('data-postid'), 10);
    ajaxurl     =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
   
    halfmap     =   0;
    newpage     =   0;
    
     if( jQuery('#google_map_prop_list_sidebar').length ){
        halfmap    = 1;
    }   
  
    postid=1;
    
    if(  document.getElementById('search_wrapper') ){
        postid      =   parseInt(jQuery('#search_wrapper').attr('data-postid'), 10);
    }
   //   
    var nonce = jQuery('#wpestate_ajax_filter_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        dataType: 'json',
     
        data: {
            'action'            :   'wpestate_classic_ondemand_pin_load_type2',
            'action_values'     :   action,
            'category_values'   :   category,
            'location'          :   location_search,
            'security'          :   nonce
        },
        success: function (data) { 
            var no_results = parseInt(data.no_results);
            
            if(no_results!==0){
                wpestate_load_on_demand_pins(data.markers,no_results,1);
            }else{
                wpestate_show_no_results();
            }
            jQuery('#gmap-loading').hide();
          
        },
        error: function (errorThrown) {
        }
    });//end ajax 
 }
 
 
 

 
 
 function wpestate_show_pins_type2_tabs(){
      "use strict";
    var action, category, location_search, ajaxurl,postid,halfmap, all_checkers,newpage,picked_tax;

    action              =   jQuery('.tab-pane.active #adv_actions').attr('data-value');
    if(typeof action === 'undefined'){
        action='';
    }
    category            =   jQuery('.tab-pane.active #adv_categ').attr('data-value');
    if(typeof category === 'undefined'){
        category='';
    }
    location_search     =   jQuery('.tab-pane.active #adv_location').val();
    picked_tax          =   jQuery('.tab-pane.active .picked_tax').val();
    
    
    postid      =   parseInt(jQuery('#adv-search-1').attr('data-postid'), 10);
    ajaxurl     =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
   
    halfmap     =   0;
    newpage     =   0;
   
    
    if( jQuery('#google_map_prop_list_sidebar').length ){
        halfmap    = 1;
    }   
  
    postid=1;
    
    if(  document.getElementById('search_wrapper') ){
        postid      =   parseInt(jQuery('#search_wrapper').attr('data-postid'), 10);
    }
   
    term_id=jQuery('.tab-pane.active .term_id_class').val();   
      
    all_checkers = '';
    jQuery('.tab-pane.active .extended_search_check_wrapper input[type="checkbox"]').each(function () {
        if (jQuery(this).is(":checked")) {
            all_checkers = all_checkers + "," + jQuery(this).attr("name");
        }
    });
    
    var nonce = jQuery('#wpestate_ajax_filter_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        dataType: 'json',
     
        data: {
            'action'            :   'wpestate_classic_ondemand_pin_load_type2_tabs',
            'action_values'     :   action,
            'category_values'   :   category,
            'location'          :   location_search,
            'picked_tax'        :   picked_tax,
            'all_checkers'      :   all_checkers,
            'security'          :   nonce
        },
        success: function (data) { 
       
            var no_results = parseInt(data.no_results);
            
            if(no_results!==0){
                wpestate_load_on_demand_pins(data.markers,no_results,1);
            }else{
                wpestate_show_no_results();
            }
               jQuery('#gmap-loading').hide();
          
        },
        error: function (errorThrown) {
           
        }
    });//end ajax 
 }
 
 
 
 function wpestate_show_pins_custom_search(){
      "use strict";
    var ajaxurl,array_last_item,how_holder,slug_holder,val_holder,position, inserted_val,temp_val,term_id,halfmap,newpage,postid,slider_min,slider_max;
    ajaxurl             =   ajaxcalls_vars.admin_url + 'admin-ajax.php';   
    inserted_val        =   0;
    array_last_item     =   parseInt( mapfunctions_vars.fields_no,10);
    val_holder          =   [];
    slug_holder         =   [];
    how_holder          =   [];
 
    slug_holder         =   mapfunctions_vars.slugs;
    how_holder          =   mapfunctions_vars.hows;
      
   
    
    
    if( mapfunctions_vars.slider_price ==='yes' ){
        slider_min = jQuery('#price_low').val();
        slider_max = jQuery('#price_max').val();
 
    }
   
    
    if( (mapfunctions_vars.adv_search_type==='6' || mapfunctions_vars.adv_search_type==='7' ) &&  !jQuery('.halfsearch')[0]){
        term_id=jQuery('.tab-pane.active .term_id_class').val();   
      
        if( mapfunctions_vars.slider_price ==='yes' ){
            slider_min = jQuery('#price_low_'+term_id).val();
            slider_max = jQuery('#price_max_'+term_id).val();
        }
    
         for (var i=0; i<array_last_item;i++){
            if ( how_holder[i]=='date bigger' || how_holder[i]=='date smaller'){
                temp_val = wpestate_get_custom_value_tab_search (term_id+slug_holder[i]);
            }else{
                temp_val = wpestate_get_custom_value_tab_search (slug_holder[i]);
            }
            
            if(typeof(temp_val)==='undefined'){
                temp_val='';
            }
            val_holder.push(  temp_val );
        }
        
    }else{
        for (var i=0; i<array_last_item;i++){
            temp_val = wpestate_get_custom_value (slug_holder[i]);
            if(typeof(temp_val)==='undefined'){
                temp_val='';
            }
            val_holder.push(  temp_val );
        }
       
    }
  
   

 
 
    if( (mapfunctions_vars.adv_search_type==='6' || mapfunctions_vars.adv_search_type==='7' || mapfunctions_vars.adv_search_type==='8' || mapfunctions_vars.adv_search_type==='9' ) ){
        var tab_tax=jQuery('.adv_search_tab_item.active').attr('data-tax');
        
        if( jQuery('.halfsearch')[0] ){
            tab_tax=jQuery('.halfsearch').attr('data-tax');
        }
       
        
        if(tab_tax === 'property_category'){
            slug_holder[array_last_item]='adv_categ';
        }else if(tab_tax === 'property_action_category'){
            slug_holder[array_last_item]='adv_actions';
        }else if(tab_tax === 'property_city'){
            slug_holder[array_last_item]='advanced_city';
        }else if(tab_tax === 'property_area'){
            slug_holder[array_last_item]='advanced_area';
        }else if(tab_tax === 'property_county_state'){
            slug_holder[array_last_item]='county-state';
        }
        
        how_holder[array_last_item]='like';
  
        if( jQuery('.halfsearch')[0] ){
            val_holder[array_last_item] = jQuery('#'+slug_holder[array_last_item]) .parent().find('input:hidden').val();
        }else{
            val_holder[array_last_item]=jQuery('.adv_search_tab_item.active').attr('data-term');
        }
 
    }
    
    if ( parseInt(mapfunctions_vars.is_half)===1 ){
        if(first_time_wpestate_show_inpage_ajax_half===0){
            first_time_wpestate_show_inpage_ajax_half=1;
        }else{
  
            wpestate_show_inpage_ajax_half();
        }
     
    } 
    //was 2 times !
      
var   all_checkers = '';
 
    jQuery('.search_wrapper .extended_search_check_wrapper  input[type="checkbox"]').each(function () {
        if (jQuery(this).is(":checked")) {
            all_checkers = all_checkers + "," + jQuery(this).attr("name");
        }
    });
 
    
    halfmap     =   0;
    newpage     =   0;
    if( jQuery('#google_map_prop_list_sidebar').length ){
        halfmap    = 1;
    }   
  
    postid=1;
    if(  document.getElementById('search_wrapper') ){
        postid      =   parseInt(jQuery('#search_wrapper').attr('data-postid'), 10);
    }


    var filter_search_action3 ='';
    var adv_location3 ='';
    
    if( mapfunctions_vars.adv_search_type==='3' ){
        filter_search_action3   = jQuery('#adv_actions').attr('data-value');
        adv_location3           = jQuery('#adv_location').val();
    }


    var filter_search_action4   ='';
    var filter_search_categ4    ='';
    var keyword_search          ='';
    if( mapfunctions_vars.adv_search_type==='4' ){
        filter_search_action4   = jQuery('#adv_actions').attr('data-value');
        filter_search_categ4    = jQuery('#adv_categ').attr('data-value');
        keyword_search          = jQuery('#keyword_search').val();
    }

    var nonce = jQuery('#wpestate_ajax_filter_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        dataType: 'json',
        data: {
            'action'                :   'wpestate_custom_ondemand_pin_load',
            'search_type'           :   mapfunctions_vars.adv_search_type,
            'val_holder'            :   val_holder,
            'newpage'               :   newpage,
            'postid'                :   postid,
            'halfmap'               :   halfmap,
            'slider_min'            :   slider_min,
            'slider_max'            :   slider_max,
            'all_checkers'          :   all_checkers,
            'filter_search_action3' :   filter_search_action3,
            'adv_location3'         :   adv_location3,
            'filter_search_action4' :   filter_search_action4,
            'filter_search_categ4'  :   filter_search_categ4,
            'keyword_search'        :   keyword_search,
            'security'              :   nonce
        },
        success: function (data) { 
            var no_results = parseInt(data.no_results);
            
            if(no_results!==0){
                wpestate_load_on_demand_pins(data.markers,no_results,1);
            }else{
                wpestate_show_no_results();
            }
            jQuery('#gmap-loading').hide();
          
        },
        error: function (errorThrown) {
            
        }
    });//end ajax     
     

 }
 
 
  
 
function wpestate_empty_map(){
     "use strict";
    if (typeof gmarkers !== 'undefined') {
        for (var i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setVisible(false);
            gmarkers[i].setMap(null);
        }
        gmarkers = [];


        if( typeof (mcluster)!=='undefined'){
            mcluster.clearMarkers();  
        }
    }
} 
 
 
 
 function wpestate_load_on_demand_pins(markers,no_results,show_results_bar){
 
    jQuery('#gmap-noresult').hide(); 

    
    wpestate_empty_map();
    if(  document.getElementById('googleMap') ){
        wpestate_setMarkers(map, markers);
   
        if (!bounds.isEmpty()) {
            wpestate_fit_bounds(bounds);
        }else{
            wpestate_fit_bounds_nolsit();
        } 
    }
        
} 


function wpestate_show_no_results(){
     "use strict";
    jQuery('#results').hide();
    jQuery('#gmap-noresult').show();
    if(  document.getElementById('google_map_prop_list_wrapper') ){
        jQuery('#listing_ajax_container').empty().append('<p class=" no_results_title ">'+mapfunctions_vars.half_no_results+'</p>');
    }
}



function wpestate_show_inpage_ajax_tip2(){
    "use strict";
    if( jQuery('#gmap-full').hasClass('spanselected')){
        jQuery('#gmap-full').trigger('click');
    }


    if(mapfunctions_vars.custom_search==='yes'){
        wpestate_custom_search_start_filtering_ajax(1);
    }else{
        wpestate_start_filtering_ajax(1);  
    } 
}
 
 
 
function wpestate_show_inpage_ajax_half(){
   "use strict";
    jQuery('.half-pagination').remove();
    if(mapfunctions_vars.custom_search==='yes'){
        wpestate_custom_search_start_filtering_ajax(1);
    }else{
        wpestate_start_filtering_ajax(1);  
    } 

}


function wpestate_enable_half_map_pin_action (){
   "use strict";
    
            
    jQuery("#google_map_prop_list_sidebar .listing_wrapper").on("hover", function(e) {

        if (e.type === "mouseenter") { 
            var listing_id = jQuery(this).attr('data-listid');
            wpestate_hover_action_pin(listing_id);
        } else if (e.type === "mouseleave") { 
            var listing_id = jQuery(this).attr('data-listid');         
            wpestate_return_hover_action_pin(listing_id);
        
        }

    });

}
    
    
/////////////////////////////////////////////////////////////////////////////////////////////////
/// get pin image
/////////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_convertToSlug(Text){
     "use strict";
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}


function wpestate_custompin(image){
    "use strict";    
  
    var extension='';
    var ratio = jQuery(window).dense('devicePixelRatio');
  
    if(ratio>1){
    
        extension='_2x';
    }


    var custom_img;
 
    if(image!==''){
        if( typeof( images[image] )=== 'undefined' || images[image]===''){
            custom_img= mapfunctions_vars.path+'/'+image+extension+'.png';     
        }else{
            custom_img=images[image];   
         
            if(ratio>1){
                custom_img=custom_img.replace(".png","_2x.png");
            }
        }
    }else{
        custom_img= mapfunctions_vars.path+'/none.png';   
    }

    if(typeof (custom_img)=== 'undefined'){
        custom_img= mapfunctions_vars.path+'/none.png'; 
    }
   
    if(ratio>1){
        image = {
            url: custom_img, 
            size :  new google.maps.Size(118, 118),
            scaledSize   :  new google.maps.Size(44, 48),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(16,49 ),
            optimized:false
        };
     
    }else{
        image = {
            url: custom_img, 
            size :  new google.maps.Size(59, 59),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(16,49 )
        };
    }

     
     
    return image;
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//// Circle label
/////////////////////////////////////////////////////////////////////////////////////////////////

function Label(opt_options) {
  // Initialization
  this.setValues(opt_options);


  // Label specific
  var span = this.span_ = document.createElement('span');
  span.style.cssText = 'position: relative; left: -50%; top: 8px; ' +
  'white-space: nowrap;  ' +
  'padding: 2px; background-color: white;opacity:0.7';


  var div = this.div_ = document.createElement('div');
  div.appendChild(span);
  div.style.cssText = 'position: absolute; display: none';
}
if (typeof google !== 'undefined') {
    Label.prototype = new google.maps.OverlayView;
}

// Implement onAdd
Label.prototype.onAdd = function() {
  var pane = this.getPanes().overlayImage;
  pane.appendChild(this.div_);


  // Ensures the label is redrawn if the text or position is changed.
  var me = this;
  this.listeners_ = [
    google.maps.event.addListener(this, 'position_changed', function() { me.draw(); }),
    google.maps.event.addListener(this, 'visible_changed', function() { me.draw(); }),
    google.maps.event.addListener(this, 'clickable_changed', function() { me.draw(); }),
    google.maps.event.addListener(this, 'text_changed', function() { me.draw(); }),
    google.maps.event.addListener(this, 'zindex_changed', function() { me.draw(); }),
    google.maps.event.addDomListener(this.div_, 'click', function() { 
      if (me.get('clickable')) {
        google.maps.event.trigger(me, 'click');
      }
    })
  ];
};


// Implement onRemove
Label.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);


  // Label is removed from the map, stop updating its position/text.
  for (var i = 0, I = this.listeners_.length; i < I; ++i) {
    google.maps.event.removeListener(this.listeners_[i]);
  }
};


// Implement draw
Label.prototype.draw = function() {
  var projection = this.getProjection();
  var position = projection.fromLatLngToDivPixel(this.get('position'));


  var div = this.div_;
  div.style.left = position.x + 'px';
  div.style.top = position.y + 'px';


  var visible = this.get('visible');
  div.style.display = visible ? 'block' : 'none';


  var clickable = this.get('clickable');
  this.span_.style.cursor = clickable ? 'pointer' : '';


  var zIndex = this.get('zIndex');
  div.style.zIndex = zIndex;


  this.span_.innerHTML = this.get('text').toString();
};



/////////////////////////////////////////////////////////////////////////////////////////////////
/// close advanced search
/////////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_close_adv_search(){  
}

//////////////////////////////////////////////////////////////////////
/// show advanced search
//////////////////////////////////////////////////////////////////////


function wpestate_new_show_advanced_search(){
     "use strict";
    jQuery("#search_wrapper").removeClass("hidden");
}

function wpestate_new_hide_advanced_search(){
     "use strict";
    if( mapfunctions_vars.show_adv_search ==='no' ){
        jQuery("#search_wrapper").addClass("hidden"); 
    }

}

function wpestate_hover_action_pin(listing_id){
 "use strict";
    for (var i = 0; i < gmarkers.length; i++) {        
        if ( parseInt( gmarkers[i].idul,10) === parseInt( listing_id,10) ){
           pin_hover_storage=gmarkers[i].icon;
//           map.setZoom(15);
           google.maps.event.trigger(gmarkers[i], 'click');
          
        }
    }
}

function wpestate_return_hover_action_pin(listing_id){
    return;

    
}


function custompinhover(){
    "use strict";    
 
    var custom_img,image;
    var extension='';
    var ratio = jQuery(window).dense('devicePixelRatio');
    
    if(ratio>1){
        extension='_2x';
    }
    custom_img= mapfunctions_vars.path+'/hover'+extension+'.png'; 
 
    if(ratio>1){
  
        image = {
            url: custom_img, 
            size :  new google.maps.Size(132, 144),
            scaledSize   :  new google.maps.Size(66, 72),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(25,72 )
          };
    
    }else{
        image = {
            url: custom_img, 
            size: new google.maps.Size(90, 90),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(25,72 )
        };
    }
   
    
    return image;
}





function wpestate_set_zoom_slider(zoomvalue){
    "use strict";
    jQuery( "#slider_zoom_map" ).slider({
        value:  zoomvalue,
        min: 1,
        max: 20,
        range: "min",
        step:1,
        orientation: "vertical",
        slide: function( event, ui ) {
            map.setZoom(ui.value );
        }
    });
}