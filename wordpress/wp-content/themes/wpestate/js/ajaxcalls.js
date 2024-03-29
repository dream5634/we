/*global $, jQuery, ajaxcalls_vars, document,mapfunctions_vars, control_vars, window, control_vars*/
///////////////////////////////////////////////////////////////////////////////////////////



function wpestate_load_stats_tabs(listing_id) {
    "use strict";
    var ajaxurl     =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
    
    var nonce = jQuery('#wpestate_load_tab_stats_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        dataType: 'json',
        data: {
            'action'            :   'wpestate_load_stats_property',
            'postid'            :   listing_id,
            'security'          :   nonce,
        },
        success: function (data) {  
            wpestate_show_prop_stat_graph_tab (data.array_values , data.labels,listing_id);
        },
        error: function (errorThrown) {}
    });//end ajax     
}

function wpestate_show_prop_stat_graph_tab(values,labels ,listing_id){
      "use strict";
    var ctx         =   jQuery("#myChart").get(0).getContext('2d');
    var myNewChart  =   new Chart(ctx);
   
   
    var data = {
    labels:labels ,
    datasets: [
         {
            label: "My First dataset",
            fillColor: "rgba(245,248,250,0.75)",
            strokeColor: "rgba(77,203,143,0.8)",
            highlightFill: "rgba(77,203,143,0.8)",
            highlightStroke: "rgba(77,203,143,1)",
            data: values
        },
    ]
    };
    
    var options = {
       //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
       scaleBeginAtZero : true,

       //Boolean - Whether grid lines are shown across the chart
       scaleShowGridLines : true,

       //String - Colour of the grid lines
       scaleGridLineColor : "rgba(0,0,0,.05)",

       //Number - Width of the grid lines
       scaleGridLineWidth : 1,

       //Boolean - Whether to show horizontal lines (except X axis)
       scaleShowHorizontalLines: true,

       //Boolean - Whether to show vertical lines (except Y axis)
       scaleShowVerticalLines: true,

       //Boolean - If there is a stroke on each bar
       barShowStroke : true,

       //Number - Pixel width of the bar stroke
       barStrokeWidth : 2,

       //Number - Spacing between each of the X value sets
       barValueSpacing : 5,

       //Number - Spacing between data sets within X values
       barDatasetSpacing : 1,

       //String - A legend template
       legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };
 
    var myBarChart = new Chart(ctx).Bar(data, options);
}



function wpestate_load_stats(listing_id) {
    "use strict";
    var ajaxurl     =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_load_tab_stats_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        dataType: 'json',
        data: {
            'action'            :   'wpestate_load_stats_property',
            'postid'            :   listing_id,
            'security'          :   nonce
        },
        success: function (data) {  
            wpestate_show_prop_stat_graph (data.array_values , data.labels,listing_id);
        },
        error: function (errorThrown) {}
    });//end ajax     
}

function wpestate_show_prop_stat_graph(values,labels ,listing_id){
      "use strict";
    var ctx         =   jQuery("#myChart_"+listing_id).get(0).getContext('2d');
    var myNewChart  =   new Chart(ctx);
   
   
    var data = {
    labels:labels ,
    datasets: [
         {
            label: "My First dataset",
            fillColor: "rgba(245,248,250,0.75)",
            strokeColor: "rgba(77,203,143,0.8)",
            highlightFill: "rgba(77,203,143,0.8)",
            highlightStroke: "rgba(77,203,143,1)",
            data: values
        },
    ]
    };
    
    var options = {
       //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
       scaleBeginAtZero : true,

       //Boolean - Whether grid lines are shown across the chart
       scaleShowGridLines : true,

       //String - Colour of the grid lines
       scaleGridLineColor : "rgba(0,0,0,.05)",

       //Number - Width of the grid lines
       scaleGridLineWidth : 1,

       //Boolean - Whether to show horizontal lines (except X axis)
       scaleShowHorizontalLines: true,

       //Boolean - Whether to show vertical lines (except Y axis)
       scaleShowVerticalLines: true,

       //Boolean - If there is a stroke on each bar
       barShowStroke : true,

       //Number - Pixel width of the bar stroke
       barStrokeWidth : 2,

       //Number - Spacing between each of the X value sets
       barValueSpacing : 5,

       //Number - Spacing between data sets within X values
       barDatasetSpacing : 1,

       //String - A legend template
       legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };
 
    var myBarChart = new Chart(ctx).Bar(data, options);
}


//////////////////////////////////////////////////////////////////////////////////////////////
/// ajax filtering on header search ; jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_start_filtering_ajax(newpage) {
    "use strict";
  
    var action, category, city, area, rooms, baths, min_price, price_max, ajaxurl,postid,halfmap, all_checkers;
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
    
    halfmap    = 0;
  
    if( jQuery('#google_map_prop_list_sidebar').length ){
        halfmap    = 1;
    }   
  
    postid=1;
    if(  document.getElementById('search_wrapper') ){
        postid      =   parseInt(jQuery('#search_wrapper').attr('data-postid'), 10);
    }
    
    all_checkers = '';
    jQuery('.extended_search_check_wrapper  input[type="checkbox"]').each(function () {
        if (jQuery(this).is(":checked")) {
            all_checkers = all_checkers + "," + jQuery(this).attr("name");
        }
    });
    
    halfmap    = 0;
    
    if( jQuery('#google_map_prop_list_sidebar').length ){
        halfmap    = 1;
    }   
    
    jQuery('#listing_ajax_container').empty();
    jQuery('#listing_loader').show();
    var nonce = jQuery('#wpestate_ajax_filter_nonce').val();
    
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_filter_listings_search',
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
            jQuery('#listing_loader').hide();
            jQuery('.listing_loader_title').show();
            jQuery('.pagination_nojax').hide();
            jQuery('#listing_ajax_container').empty().append(data);
          
            
            westate_restart_js_after_ajax();
            wpestate_check_in_viewport();
          
        },
        error: function (errorThrown) {}
    });//end ajax     
}



function wpestate_typeof_value(val1, slug){
    "use strict";

    if( typeof(val1)!=="undefined"){
        if( !jQuery('#'+slug).hasClass('filter_menu_trigger') ){ 
         
            if(slug !== 'adv_categ' && slug !== 'adv_actions' &&  
                slug !== 'advanced_city' &&  slug !== 'advanced_area'  &&  
                slug !== 'county-state' && slug !== 'property-country'   ){
                val1=val1;
              
            }  else{
                val1=val1.replace("-"," ");
            }
        }
        
    }else{
        val1='';
    }
    return val1;
}

//////////////////////////////////////////////////////////////////////////////////////////////
/// ajax filtering on header search ; jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_custom_search_start_filtering_ajax(newpage) {
    "use strict";
 
    var   temp_val,array_last_item,how_holder,slug_holder,val_holder, ajaxurl,postid , slider_min, slider_max, halfmap, all_checkers,term_id;
  
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
  
    
           
    if( (mapfunctions_vars.adv_search_type==='6' || mapfunctions_vars.adv_search_type==='7'||  mapfunctions_vars.adv_search_type==='8' || mapfunctions_vars.adv_search_type==='9') ){
    
      
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
 
     
    all_checkers = '';
    jQuery('.extended_search_check_wrapper  input[type="checkbox"]').each(function () {
        if (jQuery(this).is(":checked")) {
            all_checkers = all_checkers + "," + jQuery(this).attr("name");
        }
    });
    
 
    halfmap    = 0;
    
    if( jQuery('#google_map_prop_list_sidebar').length ){
        halfmap    = 1;
    }   
    postid=1;
    if(  document.getElementById('search_wrapper') ){
        postid      =   parseInt(jQuery('#search_wrapper').attr('data-postid'), 10);
    }
    ajaxurl     =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
 
 
   
    jQuery('#listing_ajax_container').empty();
    jQuery('#listing_loader').show();
    var nonce = jQuery('#wpestate_ajax_filter_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_custom_adv_ajax_filter_listings_search',
            'val_holder'        :   val_holder,
            'newpage'           :   newpage,
            'postid'            :   postid,
            'slider_min'        :   slider_min,
            'slider_max'        :   slider_max,
            'halfmap'           :   halfmap,
            'all_checkers'      :   all_checkers,
            'security'          :   nonce
        },
        success: function (data) {  
            jQuery('#listing_loader').hide();
            jQuery('.listing_loader_title').show();
            jQuery('.entry-title.title_prop').hide();
            jQuery('#listing_ajax_container').empty().append(data);
            westate_restart_js_after_ajax();
            jQuery('.col-md-12.listing_wrapper .property_unit_custom_element.image').each(function(){
                jQuery(this).parent().addClass('wrap_custom_image'); 
            });
           
            wpestate_check_in_viewport(); 
        },
        error: function (errorThrown) {}
    });//end ajax     
}





////////////////////////////////////////////////////////////////////////////////////////////
/// redo js after ajax calls - jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function westate_restart_js_after_ajax() {
    "use strict";
    wpestate_lazy_load_carousel_property_unit();
    
    // enable_half_map_pin_action();
    if (typeof wpestate_enable_half_map_pin_action == 'function'){
        wpestate_enable_half_map_pin_action();
    }
    var newpage, post_id, post_image, to_add, icon;
    
    jQuery('.prop-compare:first-of-type').remove();

    
    
    jQuery('.pagination_ajax_search a').on('click',function (event) {
     
        event.preventDefault();
      
        newpage = parseInt(jQuery(this).attr('data-future'), 10);
        document.getElementById('scrollhere').scrollIntoView();
        if( mapfunctions_vars.custom_search==='yes' ){
           wpestate_custom_search_start_filtering_ajax(newpage);  // should be custom
        }else{
            wpestate_start_filtering_ajax(newpage);// 
        }
    });





    jQuery('.pagination_ajax a').on('click',function (event) {
     
        event.preventDefault();
        newpage = parseInt(jQuery(this).attr('data-future'), 10);
        document.getElementById('scrollhere').scrollIntoView();
        wpestate_start_filtering(newpage);
    });
    
    jQuery('.property_listing').on('click',function(){
        
        var link;
        link = jQuery(this).attr('data-link'); 
        window.open(link, '_self');
    });
   
    jQuery('.share_unit').on('click',function(event){
       
        event.stopPropagation();
    });
   

    wpestate_compare_action();

    jQuery('.icon-fav').on('click',function (event) {
     
        event.stopPropagation();
        icon = jQuery(this);
        wpestate_add_remove_favorite(icon);
    });
   
    jQuery(".share_list, .icon-fav, .compare-action").on("hover", function(e) {

        if (e.type === "mouseenter") { 
             jQuery(this).tooltip('show');
         } else if (e.type === "mouseleave") { 
           jQuery(this).tooltip('hide');
        }

    });


       
    jQuery('.share_list').on('click',function (event) {
          
        event.stopPropagation();
        var sharediv = jQuery(this).parent().find('.share_unit');
        sharediv.toggle();
        jQuery(this).toggleClass('share_on');
    });
    
    setTimeout(function() {  jQuery('.property_listing').matchHeight(); }, 1000);
   
}

////////////////////////////////////////////////////////////////////////////////////////////
/// add remove from favorite-jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_add_remove_favorite(icon) {
    "use strict";
    var post_id, securitypass, ajaxurl;
    post_id         =  icon.attr('data-postid');
    securitypass    =  jQuery('#security-pass').val();
    ajaxurl         =  ajaxcalls_vars.admin_url + 'admin-ajax.php';
  
    if (parseInt(ajaxcalls_vars.userid, 10) === 0 ) {
        is_pop=1;
        wpestate_show_login_form();
    } else {
        icon.toggleClass('icon-fav-off');
        icon.toggleClass('icon-fav-on');
        var nonce = jQuery('#wpestate_ajax_favorite_nonce').val();
        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            dataType: 'json',
            data: {
                  'action'            :     'wpestate_ajax_add_fav',
                  'post_id'           :     post_id,
                  'security'          :     nonce
                  },
           success: function (data) {          
               if (data.added) {
                    icon.removeClass('icon-fav-off').addClass('icon-fav-on');
               } else {
                    icon.removeClass('icon-fav-on').addClass('icon-fav-off');
               }
           },
           error: function (errorThrown) {

           }
         });//end ajax
    }// end login use
} 

////////////////////////////////////////////////////////////////////////////////////////////
/// resend listing for approval-jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_resend_for_approval(prop_id, selected_div) {
    "use strict";
    var ajaxurl, normal_list_no;
    ajaxurl   =   control_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_property_actions_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'        :   'wpestate_ajax_resend_for_approval',
            'propid'        :   prop_id,
            'security'      :   nonce,
        },
        success: function (data) {
            if (data === 'pending') {
                selected_div.parent().empty().append('<span class="featured_prop">Sent for approval</span>');
                normal_list_no    =  parseInt(jQuery('#normal_list_no').text(), 10);
                jQuery('#normal_list_no').text(normal_list_no - 1);
            } else {
                selected_div.parent().empty().append(data);
            }
        },
        error: function (errorThrown) {

        }
    });//end ajax
}

////////////////////////////////////////////////////////////////////////////////////////////
/// make property featured-jslint checked
//////////////////////////////////////////////////////////////////////////////////////////// 
function wpestate_make_prop_featured(prop_id, selectedspan) {
    "use strict";
    var ajaxurl     =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
    var nonce       = jQuery('#wpestate_property_actions_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'        :   'wpestate_ajax_make_prop_featured',
            'propid'        :   prop_id,
            'security'      :   nonce
        },
        success: function (data) {
            
           
            if (data.trim() === 'done') {
                selectedspan.empty().html('<span class="label label-success">'+ajaxcalls_vars.prop_featured+'</span>');
                var featured_list_no = parseInt(jQuery('#featured_list_no').text(), 10);
                jQuery('#featured_list_no').text(featured_list_no - 1);
            } else {
                selectedspan.empty().removeClass('make_featured').addClass('featured_exp').text(ajaxcalls_vars.no_prop_featured);
            }

        },
        error: function (errorThrown) {
        }

    });//end ajax
}

////////////////////////////////////////////////////////////////////////////////////////////
/// pay package via paypal recuring-jslint checked
////////////////////////////////////////////////////////////////////////////////////////////   
function wpestate_recuring_pay_pack_via_paypal() {
    "use strict";
    var ajaxurl, packName, packId;
    ajaxurl      =   control_vars.admin_url + 'admin-ajax.php';
     
    packName = jQuery('.package_selected .pack-listing-title').text();
    packId = jQuery('.package_selected .pack-listing-title').attr('data-packid');
  
    var nonce = jQuery('#wpestate_payments_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'        :   'wpestate_ajax_paypal_pack_recuring_generation_rest_api',
            'packName'      :   packName,
            'packId'        :   packId,
            'security'      :   nonce,
        },
        success: function (data) {  
           window.location.href = data;
        },
        error: function (errorThrown) {
        }
    });//end ajax    
}

jQuery(".pack-listing .buypackage").on('click',function(){
      "use strict";
    var stripe_pack_id,stripetitle2,stripetitle,stripepay;
    jQuery(".pack-listing").each(function(){
       jQuery(this).removeClass("package_selected");
    });
  
    jQuery(this).parent().addClass("package_selected");
    
    stripetitle         = jQuery(this).parent().find('.pack-listing-title').attr('data-stripetitle');
    stripetitle2        = jQuery(this).parent().find('.pack-listing-title').attr('data-stripetitle2');
    stripepay           = jQuery(this).parent().find('.pack-listing-title').attr('data-stripepay');
    stripe_pack_id      = jQuery(this).parent().find('.pack-listing-title').attr('data-packid');
 
    jQuery('.stripe_buttons').attr("id",stripetitle2);
    jQuery('#stripe_script').attr("data-amount",stripepay);
    jQuery('#stripe_script').attr("data-description",stripetitle);
  
    jQuery('#pack_id').val(stripe_pack_id);
    jQuery('#pay_ammout').val(stripepay);
    jQuery('#stripe_form').attr('data-amount',stripepay);
    
    // enable stripe code
      
      
});



////////////////////////////////////////////////////////////////////////////////////////////
/// pay package via paypal-jslint checked
////////////////////////////////////////////////////////////////////////////////////////////   
function wpestate_pay_pack_via_paypal() {
    "use strict";
    var  ajaxurl, packName, packId;
    ajaxurl     =   control_vars.admin_url + 'admin-ajax.php';
 
    packName = jQuery('.package_selected .pack-listing-title').text();
    packId = jQuery('.package_selected .pack-listing-title').attr('data-packid');
    var nonce = jQuery('#wpestate_payments_nonce').val();
    
    
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'        :   'wpestate_ajax_paypal_pack_generation',
            'packName'      :   packName,
            'packId'        :   packId,
            'security'      :   nonce,
        },
        success: function (data) {
        
            window.location.href = data;
        },
        error: function (errorThrown) {
        }
    });//end ajax

}
////////////////////////////////////////////////////////////////////////////////////////////
/// listing pay -jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_listing_pay(prop_id, selected_div, is_featured, is_upgrade) {
    "use strict";
    var ajaxurl      =   control_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_payments_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'        :   'wpestate_ajax_listing_pay',
            'propid'        :   prop_id,
            'is_featured'   :   is_featured,
            'is_upgrade'    :   is_upgrade,
            'security'      :   nonce,
        },
        success: function (data) {
            window.location.href = data;
        },
        error: function (errorThrown) {
        }
    });//end ajax
}

////////////////////////////////////////////////////////////////////////////////////////////
/// start filtering -jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_start_filtering(newpage) {
    "use strict";

    jQuery('#gmap-loading').show();
    jQuery('#grid_view').addClass('icon_selected');
    jQuery('#list_view').removeClass('icon_selected');
    
    var action, category, city, area, order, ajaxurl,page_id;
    // get action vars
    action = jQuery('#a_filter_action').attr('data-value');
    // get category
    category = jQuery('#a_filter_categ').attr('data-value');
    // get city
    city = jQuery('#a_filter_cities').attr('data-value');
    // get area
    area = jQuery('#a_filter_areas').attr('data-value');
    // get order
    order = jQuery('#a_filter_order').attr('data-value');
    ajaxurl =  ajaxcalls_vars.admin_url + 'admin-ajax.php';
    page_id =   jQuery('#page_idx').val();
    
    jQuery('#listing_ajax_container').empty();
    jQuery('#listing_loader').show();
 
    var nonce = jQuery('#wpestate_ajax_filter_nonce').val();

    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        dataType: 'json',
        data: {
            'action'            :   'wpestate_ajax_filter_listings',
            'action_values'     :   action,
            'category_values'   :   category,
            'city'              :   city,
            'area'              :   area,
            'order'             :   order,
            'newpage'           :   newpage,
            'page_id'           :   page_id,
            'security'          :   nonce,
        },
        success: function (data) {
         
            jQuery('#listing_loader').hide();
            jQuery('#listing_ajax_container').empty().append(data.to_show);
            jQuery('.pagination_nojax').hide();
            westate_restart_js_after_ajax();
            
            // map update
            var no_results = parseInt(data.no_results);
             if(no_results!==0){
                wpestate_load_on_demand_pins(data.markers,no_results,0);
            }else{
                wpestate_show_no_results();
            }
            
            jQuery('.col-md-12.listing_wrapper .property_unit_custom_element.image').each(function(){
                jQuery(this).parent().addClass('wrap_custom_image'); 
            });
            
            jQuery('#gmap-loading').hide();
            wpestate_check_in_viewport(); 

        },
        error: function (errorThrown) {

        }
    });//end ajax
}

////////////////////////////////////////////////////////////////////////////////////////////
/// show login form on fav login-jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_show_login_form() {
    "use strict";
    jQuery('#modal_login_wpestate').fadeIn(300);
    jQuery('#user_menu_open').fadeIn(400); 

}

////////////////////////////////////////////////////////////////////////////////////////////
/// change pass on profile-jslint checked
////////////////////////////////////////////////////////////////////////////////////////////   
function wpestate_change_pass_profile() {
    "use strict";
    var oldpass, newpass, renewpass, securitypass, ajaxurl;
    oldpass         =  jQuery('#oldpass').val();
    newpass         =  jQuery('#newpass').val();
    renewpass       =  jQuery('#renewpass').val();
    var nonce           =  jQuery('#wpestate_renew_pass_nonce').val();
    ajaxurl         =  ajaxcalls_vars.admin_url + 'admin-ajax.php';

    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_update_pass',
            'oldpass'           :   oldpass,
            'newpass'           :   newpass,
            'renewpass'         :   renewpass,
            'security'          :   nonce
        },
        success: function (data) {
            jQuery('#profile_pass').empty().append('<div class="login-alert">' + data + '<div>');
            jQuery('#oldpass, #newpass, #renewpass').val('');
        },
        error: function (errorThrown) {
        }
    });
}


////////////////////////////////////////////////////////////////////////////////////////////
/// user register -jslint checked
////////////////////////////////////////////////////////////////////////////////////////////

function wpestate_register_user(type) {
    "use strict";
    var capthca,user_login_register, user_email_register, user_pass, user_pass_retype, nonce, ajaxurl;
    /* 1- topbar
     * 2- widget
     * 3- shortcode
     * 4- modal !?
     * 5 -mobile
     */
    
    capthca='';
  
    ajaxurl             =  ajaxcalls_vars.admin_url + 'admin-ajax.php'; 
    jQuery('#register_message_area_topbar').empty().append('<div class="login-alert">'+control_vars.procesing+'</div>');
   
    if(type===1){
        if(control_vars.usecaptcha==='yes'){
            capthca= grecaptcha.getResponse(
                widgetId1
            );
        }
        
        user_login_register =  jQuery('#user_login_register_topbar').val();
        user_email_register =  jQuery('#user_email_register_topbar').val();
        nonce               =  jQuery('#security-register-topbar').val(); 
        if(ajaxcalls_vars.userpass === 'yes'){
            user_pass           =  jQuery('#user_password_topbar').val();
            user_pass_retype    =  jQuery('#user_password_topbar_retype').val();
        }
        
        if ( !jQuery('#user_terms_register_topbar').is(":checked") ) {
            jQuery('#register_message_area_topbar').empty().append('<div class="login-alert">'+control_vars.terms_cond+'</div>');
            return;
        }
    }else if(type===2){
       
        if(control_vars.usecaptcha==='yes'){
            capthca= grecaptcha.getResponse(
                widgetId3
            );
        }
        
        user_login_register =  jQuery('#user_login_register_wd').val();
        user_email_register =  jQuery('#user_email_register_wd').val();
        nonce               =  jQuery('#security-register').val(); 
        if(ajaxcalls_vars.userpass === 'yes'){
            user_pass           =  jQuery('#user_password_wd').val();
            user_pass_retype    =  jQuery('#user_password_wd_retype').val();
        }
        
        if ( !jQuery('#user_terms_register_wd').is(":checked") ) {
            jQuery('#register_message_area_wd').empty().append('<div class="login-alert">'+control_vars.terms_cond+'</div>');
            return;
        }
    }else if(type===3){
        
        if(control_vars.usecaptcha==='yes'){
            capthca= grecaptcha.getResponse(
                widgetId4
            );
        }
        
        user_login_register =  jQuery('#user_login_register').val();
        user_email_register =  jQuery('#user_email_register').val();
        nonce               =  jQuery('#security-register').val(); 
        if(ajaxcalls_vars.userpass === 'yes'){
            user_pass           =  jQuery('#user_password').val();
            user_pass_retype    =  jQuery('#user_password_retype').val();
        }
       
        if ( !jQuery('#user_terms_register_sh').is(":checked") ) {
            jQuery('#register_message_area').empty().append('<div class="login-alert">'+control_vars.terms_cond+'</div>');
            return;
        }
    }else if(type===5){
        
        if(control_vars.usecaptcha==='yes'){
            capthca= grecaptcha.getResponse(
                widgetId2
            );
        }
        user_login_register =  jQuery('#user_login_register_mobile').val();
        user_email_register =  jQuery('#user_email_register_mobile').val();
        nonce               =  jQuery('#security-register-mobile').val(); 
        if(ajaxcalls_vars.userpass === 'yes'){
            user_pass           =  jQuery('#user_password_mobile').val();
            user_pass_retype    =  jQuery('#user_password_mobile_retype').val();
        }
        
        if ( !jQuery('#user_terms_register_mobile').is(":checked") ) {
            jQuery('#register_message_area_mobile').empty().append('<div class="login-alert">'+control_vars.terms_cond+'</div>');
            return;
        }
    }
    
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'                    :   'wpestate_ajax_register_user',
            'user_login_register'       :   user_login_register,
            'user_email_register'       :   user_email_register,
            'user_pass'                 :   user_pass,
            'user_pass_retype'          :   user_pass_retype,
            'type'                      :   type,
            'security-register'         :   nonce,
            'capthca'                   :   capthca,
            'security'                  :   nonce,
        },

        success: function (data) {
           // This outputs the result of the ajax request
         
            if(type===1){
                jQuery('#register_message_area_topbar').empty().append('<div class="login-alert">' + data + '</div>');
                jQuery('#user_login_register_topbar').val('');
                jQuery('#user_email_register_topbar').val('');
                jQuery('#user_password_topbar').val('');
                jQuery('#user_password_topbar_retype').val('');
            }else  if(type===2){
                jQuery('#register_message_area_wd').empty().append('<div class="login-alert">' + data + '</div>');
                jQuery('#user_login_register_wd').val('');
                jQuery('#user_email_register_wd').val('');
                jQuery('#user_password_wd').val('');
                jQuery('#user_password_wd_retype').val('');
            }else  if(type===3){
                jQuery('#register_message_area').empty().append('<div class="login-alert">' + data + '</div>');
                jQuery('#user_login_register').val('');
                jQuery('#user_email_register').val('');
                jQuery('#user_password').val('');
                jQuery('#user_password_retype').val('');
            }else  if(type===5){
                jQuery('#register_message_area_mobile').empty().append('<div class="login-alert">' + data + '</div>');
                jQuery('#user_login_register_mobile').val('');
                jQuery('#user_email_register_mobile').val('');
                jQuery('#user_password_mobile').val('');
                jQuery('#user_password_mobile_retype').val('');
            }
        },
        error: function (errorThrown) {
        }
    });
}





////////////////////////////////////////////////////////////////////////////////////////////
/// on ready -jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
function wpestate_forgot(type) {
    "use strict";
   
    var  forgot_email, securityforgot, postid, ajaxurl;
    postid                =  jQuery('#postid').val();
    if(type===1){
        forgot_email          =  jQuery('#forgot_email').val();
        securityforgot        =  jQuery('#security-forgot').val();
    }
    if(type===2){
        forgot_email          =  jQuery('#forgot_email_topbar').val();
        securityforgot        =  jQuery('#security-forgot-topbar').val();
    }
    if(type===3){
        forgot_email          =  jQuery('#forgot_email_shortcode').val();
        securityforgot        =  jQuery('#security-login-forgot_wd').val();
    }
    if(type===5){
        forgot_email          =  jQuery('#forgot_email_mobile').val();
        securityforgot        =  jQuery('#security-forgot-mobile').val();
        postid                =  jQuery('#postid_mobile').val();
    }
    
    ajaxurl               =  ajaxcalls_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_forgot_pass',
            'forgot_email'      :   forgot_email,
            'security-forgot'    :  securityforgot,
            'postid'            :   postid,
            'type'              :   type,
            'security'          :   nonce
            
        },

        success: function (data) {
        
            if(type===1){
                jQuery('#forgot_email').val('');
                jQuery('#forgot_pass_area').empty().append('<div class="login-alert">' + data + '<div>');        
            }
            if(type===2){
                jQuery('#forgot_email_topbar').val('');
                jQuery('#forgot_pass_area_topbar').empty().append('<div class="login-alert">' + data + '<div>');        
            }
            if(type===3){
                jQuery('#forgot_email_shortcode').val('');
                jQuery('#forgot_pass_area_shortcode').empty().append('<div class="login-alert">' + data + '<div>');        
            }
            if(type===5){
                jQuery('#forgot_email_mobile').val('');
                jQuery('#forgot_pass_area_mobile').empty().append('<div class="login-alert">' + data + '<div>');        
            }
        },
        error: function (errorThrown) {
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////
/// on ready-jslint checked
////////////////////////////////////////////////////////////////////////////////////////////   
function wpestate_login_wd() {
    "use strict";
    var login_user, login_pwd, ispop, ajaxurl, security;

    login_user          =  jQuery('#login_user_wd').val();
    login_pwd           =  jQuery('#login_pwd_wd').val();
    security            =  jQuery('#security-login').val();
    ispop               =  jQuery('#loginpop_wd').val();
    ajaxurl             =  ajaxcalls_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    jQuery('#login_message_area_wd').empty().append('<div class="login-alert">' + ajaxcalls_vars.login_loading + '</div>');
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_loginx_form',
            'login_user'        :   login_user,
            'login_pwd'         :   login_pwd,
            'ispop'             :   ispop,
            'security-login'    :   security,
            'security'          :   nonce,
        },

        success: function (data) {
            jQuery('#login_message_area_wd').empty().append('<div class="login-alert">' + data.message + '<div>');
            if (data.loggedin === true) {
                if (parseInt(data.ispop, 10) === 1) {
                    ajaxcalls_vars.userid = data.newuser;
                    jQuery('#ajax_login_container').remove();
                } else {
                    document.location.href = ajaxcalls_vars.login_redirect;
                }
                jQuery('#user_not_logged_in').hide();
                jQuery('#user_logged_in').show();
            } else {
                jQuery('#login_user').val('');
                jQuery('#login_pwd').val('');
            }
        },
        error: function (errorThrown) {
          
        }
    });
}


////////////////////////////////////////////////////////////////////////////////////////////
/// on ready-jslint checked
////////////////////////////////////////////////////////////////////////////////////////////   
function wpestate_login_topbar() {
    "use strict";
    var login_user, login_pwd, ajaxurl, security;

    login_user          =  jQuery('#login_user_topbar').val();
    login_pwd           =  jQuery('#login_pwd_topbar').val();
    security            =  jQuery('#security-login-topbar').val();
    ajaxurl             =  ajaxcalls_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    jQuery('#login_message_area_topbar').empty().append('<div class="login-alert">' + ajaxcalls_vars.login_loading + '</div>');
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_loginx_form_topbar',
            'login_user'        :   login_user,
            'login_pwd'         :   login_pwd,
            'security'          :   nonce
        },

        success: function (data) {
          
            jQuery('#login_message_area_topbar').empty().append('<div class="login-alert">' + data.message + '<div>');
            if (data.loggedin === true) {
         
               if (is_pop === 1) {
                    ajaxcalls_vars.userid = data.newuser;
                    jQuery('#modal_login_wpestate').hide();
                } else {
                    document.location.href = ajaxcalls_vars.login_redirect;
                }
                
            } else {
                jQuery('#login_user').val('');
                jQuery('#login_pwd').val('');
            }
        },
        error: function (errorThrown) {
         
        }
    });
}


function wpestate_login_mobile() {
    "use strict";
    var login_user, login_pwd, ispop, ajaxurl, security;

    login_user          =  jQuery('#login_user_mobile').val();
    login_pwd           =  jQuery('#login_pwd_mobile').val();
    security            =  jQuery('#security-login-mobile').val();
    ajaxurl             =  ajaxcalls_vars.admin_url + 'admin-ajax.php';
    var nonce           =  jQuery('#wpestate_login_register_nonce').val();
    
    jQuery('#login_message_area_mobile').empty().append('<div class="login-alert">' + ajaxcalls_vars.login_loading + '</div>');
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_loginx_form_mobile',
            'login_user'        :   login_user,
            'login_pwd'         :   login_pwd,
            'security'          :   nonce
        },

        success: function (data) {
     
            jQuery('#login_message_area_mobile').empty().append('<div class="login-alert">' + data.message + '<div>');
            if (data.loggedin === true) {
              document.location.href = ajaxcalls_vars.login_redirect;
            } else {
                jQuery('#login_user_mobile').val('');
                jQuery('#login_pwd_mobile').val('');
            }
        },
        error: function (errorThrown) {
           
        }
    });
}

////////////////////////////////////////////////////////////////////////////////
// enable actions modal -jslint checked
////////////////////////////////////////////////////////////////////////////////
function wpestate_enable_actions_modal() {
    "use strict";
    jQuery('#facebooklogin').on('click',function () {
        jQuery('#cover').hide();
        wpestate_login_via_facebook(jQuery(this));
    });

    jQuery('#yahoologin').on('click',function () {
        jQuery('#cover').hide();
        wpestate_login_via_google(jQuery(this));
    });

    jQuery('#googlelogin').on('click',function () {
        jQuery('#cover').hide();
         wpestate_login_via_google_oauth();
    });
    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  open id login - via google
    //////////////////////////////////////////////////////////////////////////////////////////// 

 


 


    jQuery('#closeadvancedlogin').on('click',function () {
     
        jQuery('#ajax_login_container').remove();
        jQuery('#cover').remove();
    });

    jQuery('#reveal_register').on('click',function () {
        
        jQuery('#ajax_login_div').fadeOut(400, function () {
            jQuery('#ajax_register_div').fadeIn();
        });
    });

    jQuery('#reveal_login').on('click',function () {
   
        jQuery('#ajax_register_div').fadeOut(400, function () {
            jQuery('#ajax_login_div').fadeIn();
        });
    });


    jQuery('#wp-login-but').on('click',function () {
        
        wpestate_login();
    });

    jQuery('#login_pwd, #login_user').keydown(function (e) {
      
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_login();
        }
    });


    jQuery('#wp-submit-register').on('click',function () {
      
        wpestate_register_user(3);
    });

    jQuery('#user_email_register, #user_login_register, #user_password, #user_password_retype').keydown(function (e) {
      
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_register_user(3);
        }
    });
}


////////////////////////////////////////////////////////////////////////////////
// login function -jslint checked
////////////////////////////////////////////////////////////////////////////////
function wpestate_login() {
    
    "use strict";
    var login_user, login_pwd, security, ispop, ajaxurl;
    login_user          =  jQuery('#login_user').val();
    login_pwd           =  jQuery('#login_pwd').val();
    security            =  jQuery('#security-login').val();
    ispop               =  jQuery('#loginpop').val();
    ajaxurl             =  ajaxcalls_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    jQuery('#login_message_area').empty().append('<div class="login-alert">' + ajaxcalls_vars.login_loading + '</div>');
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_loginx_form',
            'login_user'        :   login_user,
            'login_pwd'         :   login_pwd,
            'ispop'             :   ispop,
            'security-login'    :   security,
            'security'          :   nonce,
        },
        success: function (data) {
            jQuery('#login_message_area').empty().append('<div class="login-alert">' + data.message + '<div>');
            if (data.loggedin === true) {
                if (parseInt(data.ispop, 10) === 1) {
                   
                    ajaxcalls_vars.userid = data.newuser;
                    jQuery('#loginmodal').modal('hide');
                    wpestate_new_update_menu_bar(data.newuser);
                } else {
                    document.location.href = ajaxcalls_vars.login_redirect;
                }
                jQuery('#user_not_logged_in').hide();
                jQuery('#user_logged_in').show();
            } else {
                jQuery('#login_user').val('');
                jQuery('#login_pwd').val('');
            }
        },
        error: function (errorThrown) {
        }
    });
}

////////////////////////////////////////////////////////////////////////////////
// login via facebook-jslint checked
////////////////////////////////////////////////////////////////////////////////    
function wpestate_login_via_facebook(button) {
    "use strict";
    var login_type, ajaxurl;
    ajaxurl     =   control_vars.admin_url + 'admin-ajax.php';
    login_type  =   'facebook';
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_facebook_login',
            'login_type'        :   login_type,
            'security'          :   nonce,
         
        },
        success: function (data) {
            window.location.href = data;
        },
        error: function (errorThrown) {
           
        }
    });//end ajax
}

////////////////////////////////////////////////////////////////////////////////
// login via google / openid -jslint checked
////////////////////////////////////////////////////////////////////////////////
function wpestate_login_via_google(button) {
    "use strict";
    var ajaxurl, login_type;
    ajaxurl         =  control_vars.admin_url + 'admin-ajax.php';
    login_type      =  button.attr('data-social');
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_google_login',
            'login_type'        :   login_type,
            'security'          :   nonce
        },
        success: function (data) {
            window.location.href = data;
        },
        error: function (errorThrown) {
        }
    });//end ajax
}
////////////////////////////////////////////////////////////////////////////////
// login via google / openid -jslint checked
////////////////////////////////////////////////////////////////////////////////

function wpestate_login_via_google_oauth() {
    "use strict";
    var ajaxurl, login_type;
    ajaxurl         =  control_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            'action'            :   'wpestate_ajax_google_login_oauth',
            'security'          :   nonce
        },
        success: function (data) {
            window.location.href = data;
        },
        error: function (errorThrown) {
        }
    });//end ajax
}

////////////////////////////////////////////////////////////////////////////////
// update bar after login -jslint checked
////////////////////////////////////////////////////////////////////////////////
function wpestate_new_update_menu_bar(newuser) {
    "use strict";
    var usericon, ajaxurl;
    ajaxurl =   control_vars.admin_url + 'admin-ajax.php';
    var nonce = jQuery('#wpestate_login_register_nonce').val();
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajaxurl,
        data: {
            'action'            :   "wpestate_update_menu_bar",
            'newuser'           :    newuser,
            'security'          :   nonce
        },
        success: function (data) {
      
            jQuery('#user_menu_open').empty().append(data.menu).addClass('menulist');
            usericon = '<div class="menu_user_picture" style="background-image: url(' + data.picture + ')"></div>';
            jQuery('#user_menu_u').append(usericon).addClass('user_loged');
            jQuery('.submit_action').remove();
            
        },
        error: function (errorThrown) {
        }
    });//end ajax
}

////////////////////////////////////////////////////////////////////////////////////////////
/// on ready -jslint checked
////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).ready(function ($) {
    "use strict";
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////
    //// stripe cancel
    ///////////////////////////////////////////////////////////////////////////////////////////
   $('.disable_listing').on('click',function () {
        var prop_id     =   $(this).attr('data-postid');
        var ajaxurl     =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
        var is_disabled =   0;
        if ( $(this).hasClass('disabledx') ){
            is_disabled=1;
            $(this).removeClass('disabledx');
        }else{
              $(this).addClass('disabledx');
        }
        var element     = $(this);
        var container   = $(this).parent().parent(); 
        var nonce = jQuery('#wpestate_property_actions_nonce').val();
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                'action'       :   'wpestate_disable_listing',
                'prop_id'      :   prop_id,
                'security'     :   nonce,
               
            },
            success: function (data) {
                //location.reload();
                if (is_disabled===1){
                    element.empty().append('<i class="fa fa-play"></i>');
                    container.find('.user_dashboard_status').empty().append('<span class="label label-info">'+ajaxcalls_vars.disabled+'</span>');
                  
                    element.tooltip('hide')
                    .attr('data-original-title', ajaxcalls_vars.enablelisting)
                    .tooltip('fixTitle')
                    .tooltip('show');
  
                }else{
                    element.empty().append('<i class="fa fa-pause"></i>');
                    container.find('.user_dashboard_status').empty().append('<span class="label label-success">'+ajaxcalls_vars.published+'</span>');
                    element.tooltip('hide')
                    .attr('data-original-title', ajaxcalls_vars.disablelisting)
                    .tooltip('fixTitle')
                    .tooltip('show');
                }
               
                
            },
            error: function (errorThrown) {
            }
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////////////
    //// stripe cancel
    ///////////////////////////////////////////////////////////////////////////////////////////
    $('#stripe_cancel').on('click',function(){
          
        var stripe_user_id, ajaxurl;
        stripe_user_id    =   $(this).attr('data-stripeid');
        ajaxurl         =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
        $('#stripe_cancel').text(ajaxcalls_vars.saving);
         var nonce = jQuery('#wpestate_payments_nonce').val();
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                'action'                  :     'wpestate_cancel_stripe',
                'stripe_customer_id'      :     stripe_user_id,
                'security'                :     nonce,
               
            },
            success: function (data) {
                $('#stripe_cancel').text(ajaxcalls_vars.stripecancel);
            },
            error: function (errorThrown) {
            }
        });
    });


    ////////////////////////////////////////////////////////////////////////////////////////////
    /// resend for approval  
    ///////////////////////////////////////////////////////////////////////////////////////////
    $('.resend_pending').on('click',function () {
    
        var prop_id = $(this).attr('data-listingid');
        wpestate_resend_for_approval(prop_id, $(this));
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  set featured inside membership
    ///////////////////////////////////////////////////////////////////////////////////////////  
    $('.make_featured').on('click',function () {
        
        var prop_id = $(this).attr('data-postid');
        wpestate_make_prop_featured(prop_id, $(this));
        $(this).unbind( "click" );
    });


    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  pack upgrade via paypal    
    ///////////////////////////////////////////////////////////////////////////////////////////  
    $('#pick_pack').on('click',function () {
        
        var pay_paypal;
        pay_paypal='<div class="modal fade" id="paypal_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-body listing-submit">'+ajaxcalls_vars.paypal+'</div></div></div></div></div>';
        jQuery('body').append(pay_paypal);
        jQuery('#paypal_modal').modal();
            
            
        if ($('#pack_recuring').is(':checked')) {
            wpestate_recuring_pay_pack_via_paypal();
        } else {
            wpestate_pay_pack_via_paypal();
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    //////// listing pay via paypal
    ///////////////////////////////////////////////////////////////////////////////////////////  
    $('.listing_submit_normal').on('click',function () {
    
        var prop_id, featured_checker, is_featured, is_upgrade,pay_paypal;
        pay_paypal='<div class="modal fade" id="paypal_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-body listing-submit">'+ajaxcalls_vars.paypal+'</div></div></div></div></div>';
        jQuery('body').append(pay_paypal);
        jQuery('#paypal_modal').modal();
        
        
        prop_id = $(this).attr('data-listingid');
        featured_checker = $(this).parent().find('input');
        is_featured = 0;
        is_upgrade = 0;

        if (featured_checker.prop('checked')) {
            is_featured = 1;
        } else {
            is_featured = 0;
        }

        wpestate_listing_pay(prop_id, $(this), is_featured, is_upgrade);
    });


    $('.listing_upgrade').on('click',function () {
        
        var is_upgrade, is_featured, prop_id;
        is_upgrade = 1;
        is_featured = 0;
        prop_id = $(this).attr('data-listingid');
        wpestate_listing_pay(prop_id, $(this), is_featured, is_upgrade);
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  login via facebook conect    
    ///////////////////////////////////////////////////////////////////////////////////////////  

    $('#facebooklogin, #facebookloginsidebar, #facebookloginsidebar_topbar,#facebookloginsidebar_mobile').on('click',function () {
   
        wpestate_login_via_facebook($(this));
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  open id login - via google
    //////////////////////////////////////////////////////////////////////////////////////////// 

    $('#yahoologin, #aollogin,  #yahoologinsidebar, #yahoologinsidebar_topbar,#yahoologinsidebar_mobile').on('click',function () {
   
        wpestate_login_via_google($(this));
    });

  $('#googlelogin, #googleloginsidebar, #googleloginsidebar_topbar,#googleloginsidebar_mobile').on('click',function () {
    
        wpestate_login_via_google_oauth();
    });

    ///////////////////////////////////////////////////////////////////////////////////////////
    /////// Property page  + ajax call on contact
    ///////////////////////////////////////////////////////////////////////////////////////////
   // $('#agent_submit').on('click',function () {
        
    $('.agent_submit_class').on('click',function () {
        
        var parent,contact_name, contact_email, contact_phone, contact_coment, agent_id, property_id, nonce, ajaxurl;
        parent=$(this).parent();
        contact_name    =   parent.find('#agent_contact_name').val();
        contact_email   =   parent.find('#agent_user_email').val();
        contact_phone   =   parent.find('#agent_phone').val();
        contact_coment  =   parent.find('#agent_comment').val();
        agent_id        =   parent.find('#agent_id').val();
        property_id     =   parent.find('#agent_property_id').val();
        nonce           =   parent.find('#wpestate_agent_property_ajax_nonce').val();
        ajaxurl         =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
        
        parent.find('#alert-agent-contact').empty().append(ajaxcalls_vars.sending);

        $.ajax({
            type: 'POST',
            dataType: 'json',
           url: ajaxurl,
            data: {
                'action'    :   'wpestate_ajax_agent_contact_form',
                'name'      :   contact_name,
                'email'     :   contact_email,
                'phone'     :   contact_phone,
                'comment'   :   contact_coment,
                'agent_id'  :   agent_id,
                'propid'    :   property_id,
                'security'     :   nonce
            },
            success: function (data) {
                if (data.sent) {
                    parent.find('#agent_contact_name').val('');
                    parent.find('#agent_user_email').val('');
                    parent.find('#agent_phone').val('');
                    parent.find('#agent_comment').val('');
                }
                parent.find('#alert-agent-contact').empty().append(data.response);
            },
            error: function (errorThrown) {
            
            }
        });
    });

    

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  property listing listing
    ////////////////////////////////////////////////////////////////////////////////////////////       

    $('.listing_filters_head li').on('click',function () {
       
        var pick, value, parent;
        pick = $(this).text();
        value = $(this).attr('data-value');
        parent = $(this).parent().parent();
        parent.find('.filter_menu_trigger').text(pick).append('<span class="caret caret_filter"></span>').attr('data-value',value);
        parent.find('input:hidden'). val(value);
       
        wpestate_start_filtering(1);
        
       
    });
    
    
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////  
    //////// advanced search filtering
    ////////////////////////////////////////////////////////////////////////////////////////////       

    $('.adv_listing_filters_head li').on('click',function () {

        var pick, value, parent, args,page_id,ajaxurl;
        ajaxurl         =   ajaxcalls_vars.admin_url + 'admin-ajax.php';
        pick        = $(this).text();
        value       = $(this).attr('data-value');
        parent      = $(this).parent().parent();
        parent.find('.filter_menu_trigger').text(pick).append('<span class="caret caret_filter"></span>').attr('data-value',value);
        args        = $('#searcharg').val();
        page_id     = $('#page_idx').val();
        $('#listing_ajax_container').empty();
        $('#listing_loader').show();
        var nonce = jQuery('#wpestate_ajax_filter_nonce').val();
        $.ajax({
                type: 'POST',
                url: ajaxurl,
              
                data: {
                    'action'    :   'wpestate_advanced_search_filters',
                    'args'      :   args,
                    'value'     :   value,
                    'page_id'   :   page_id,
                    'security'  :   nonce,
                },
                success: function (data) {
               
                    $('#listing_loader').hide();
                    $('#listing_ajax_container').append(data);
         
                    westate_restart_js_after_ajax();
                    wpestate_add_pagination_orderby();
                    wpestate_check_in_viewport();
                },
                error: function (errorThrown) {
                }
            }); //end ajax
    });

   
    function wpestate_add_pagination_orderby(){
     
        var   order = $('#a_filter_order').attr('data-value');
        
        jQuery('.pagination a').each(function(){
            var href = $(this).attr('href');
            href=href+"&order_search="+order;
            $(this).attr('href',href);

        });

     

    }

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  Ajax add to favorites on listing
    ////////////////////////////////////////////////////////////////////////////////////////////        
    $('.icon-fav').on('click',function (event) {
        
        event.stopPropagation();
        var icon = $(this);
        wpestate_add_remove_favorite(icon);
    });

    // remove from fav listing on user profile
    $('.icon-fav-on-remove').on('click',function (event) {
        event.stopPropagation();
        $(this).parent().parent().remove();
        
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  Ajax add to favorites on propr
    ////////////////////////////////////////////////////////////////////////////////////////////        
    $('#add_favorites').on('click',function () {
        
        var post_id, securitypass, ajaxurl;
        post_id         =  $('#add_favorites').attr('data-postid');
        securitypass    =  $('#security-pass').val();
        ajaxurl         =  ajaxcalls_vars.admin_url + 'admin-ajax.php';

        if (parseInt(ajaxcalls_vars.userid, 10)  === 0) {
            wpestate_show_login_form();
        } else {
            $('#add_favorites').text(ajaxcalls_vars.saving);
             var nonce = jQuery('#wpestate_ajax_favorite_nonce').val();
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                dataType: 'json',
                data: {
                    'action'            :   'wpestate_ajax_add_fav',
                    'post_id'           :    post_id,
                    'security'          :    nonce
                },
                success: function (data) {
                    if (data.added) {
                        $('#add_favorites').text(ajaxcalls_vars.favorite).removeClass('isnotfavorite').addClass('isfavorite');
                    } else {
                        $('#add_favorites').text(ajaxcalls_vars.add_favorite).removeClass('isfavorite').addClass('isnotfavorite');
                    }
                },
                error: function (errorThrown) {
                }
            }); //end ajax
        }// end check login
    });


    ////////////////////////////////////////////////////////////////////////////////
    // register calls and functions
    ////////////////////////////////////////////////////////////////////////////////
    $('#wp-submit-register').on('click',function () {
     
        wpestate_register_user(3);
    });

    jQuery('#user_email_register, #user_login_register, #user_password, #user_password_retype').keydown(function (e) {
     
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_register_user(3);
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  WIDGET Register ajax
    ////////////////////////////////////////////////////////////////////////////////////////////
    $('#wp-submit-register_wd').on('click',function () {
       
        wpestate_register_user(2);
    });

    $('#user_email_register_wd, #user_login_register_wd').keydown(function (e) {
       
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_register_user(2);
        }
    });
   
    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  TOPBAR Register ajax
    ////////////////////////////////////////////////////////////////////////////////////////////
    $('#wp-submit-register_topbar').on('click',function () {
  
        wpestate_register_user(1);
    });

    $('#user_email_register_topbar, #user_login_register_topbar, #user_password_topbar, #user_password_topbar_retype').keydown(function (e) {
  
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_register_user(1);
        }
    });
    
     $('#wp-submit-register_mobile').on('click',function () {
   
        wpestate_register_user(5);
    });

    $('#user_email_register_mobile, #user_login_register_mobile, #user_password_mobile, #user_password_mobile_retype').keydown(function (e) {
      
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_register_user(5);
        }
    });
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  login/forgot password  actions
    ////////////////////////////////////////////////////////////////////////////////////////////  
    $('#forgot_pass').on('click',function (event) {
    
        event.preventDefault();
        $("#login-div").hide();
        $("#forgot-pass-div-sh").show();
    });

    $('#return_login').on('click',function (event) {
     
        event.preventDefault();
        $("#forgot-pass-div-sh").hide();
        $("#login-div").show();
    });


    $('#forgot_pass_topbar').on('click',function (event) {
 
        event.preventDefault();
        $("#login-div_topbar,#login-div-title-topbar").hide();
        $("#forgot-div-title-topbar,#forgot-pass-div").show();
    });


    $('#forgot_pass_mobile').on('click',function (event) {
       
        event.preventDefault();
        $("#login-div_mobile,#login-div-title-mobile").hide();
        $("#forgot-div-title-mobile,#forgot-pass-div-mobile").show();
    });


    $('#return_login_topbar').on('click',function (event) {
   
        event.preventDefault();
        $("#forgot-div-title-topbar,#forgot-pass-div").hide();
        $("#login-div_topbar,#login-div-title-topbar").show();
    });

    $('#return_login_mobile').on('click',function (event) {
 
        event.preventDefault();
        $("#forgot-div-title-mobile,#forgot-pass-div-mobile").hide();
        $("#login-div_mobile,#login-div-title-mobile").show();
    });

    $('#forgot_pass_widget').on('click',function (event) {
    
        event.preventDefault();
        $("#login-div-title,#login-div").hide();
        $("#forgot-pass-div_shortcode,#forgot-div-title_shortcode").show();
    });

    $('#return_login_shortcode').on('click',function (event) {
    
        event.preventDefault();
        $("#forgot-pass-div_shortcode,#forgot-div-title_shortcode").hide();
        $("#login-div-title,#login-div").show();
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  forgot pass  
    ////////////////////////////////////////////////////////////////////////////////////////////
    $('#wp-forgot-but').on('click',function () {
    
        wpestate_forgot(1);
    });
    
    $('#wp-forgot-but-topbar').on('click',function () {
      
        wpestate_forgot(2);
    });
     
    $('#wp-forgot-but-mobile').on('click',function () {
    
        wpestate_forgot(5);
    });
    
    
    $('#wp-forgot-but_shortcode').on('click',function () {
          
        wpestate_forgot(3);
    });
    

    $('#forgot_email').keydown(function (e) {
       
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_forgot(1);
        }
    });

    $('#forgot_email_topbar').keydown(function (e) {
     
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_forgot(2);
        }
    });
    
    $('#forgot_email_topbar').keydown(function (e) {
       
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_forgot(3);
        }
    });
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////  
    //////// TOPBAR  login/forgot password  actions
    ////////////////////////////////////////////////////////////////////////////////////////////     
    $('#widget_register_topbar').on('click',function (event) {
     
        event.preventDefault();
        $('#login-div_topbar').hide();
        $('#register-div-topbar').show();
        $('#login-div-title-topbar').hide();
        $('#register-div-title-topbar').show();
    });

    $('#widget_login_topbar').on('click',function (event) {
      
        event.preventDefault();
        $('#login-div_topbar').show();
        $('#register-div-topbar').hide();
        $('#login-div-title-topbar').show();
        $('#register-div-title-topbar').hide();
    });
    
    $('#widget_register_mobile').on('click',function (event) {
        
        event.preventDefault();
        $('#login-div_mobile').hide();
        $('#register-div-mobile').show();
        $('#login-div-title-mobile').hide();
        $('#register-div-title-mobile').show();
    });

    $('#widget_login_mobile').on('click',function (event) {
         
        event.preventDefault();
        $('#login-div_mobile').show();
        $('#register-div-mobile').hide();
        $('#login-div-title-mobile').show();
        $('#register-div-title-mobile').hide();
    });
    
    
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////  
    //////// WIDGET  login/forgot password  actions
    ////////////////////////////////////////////////////////////////////////////////////////////     
    $('#widget_register_sw').on('click',function (event) {
      
        event.preventDefault();
        $('.loginwd_sidebar #login-div').hide();
        $('.loginwd_sidebar #register-div').show();
        $('.loginwd_sidebar #login-div-title').hide();
        $('.loginwd_sidebar #register-div-title').show();
    });

    $('#widget_login_sw').on('click',function (event) {
     
        event.preventDefault();
        $('.loginwd_sidebar #register-div').hide();
        $('.loginwd_sidebar #login-div').show();
        $('.loginwd_sidebar #register-div-title').hide();
        $('.loginwd_sidebar #login-div-title').show();
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  login  ajax
    ////////////////////////////////////////////////////////////////////////////////////////////
    $('#wp-login-but').on('click',function () {
    
        wpestate_login();
    });

    $('#login_pwd, #login_user').keydown(function (e) {
       
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_login();
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  WIDGET login  ajax
    ////////////////////////////////////////////////////////////////////////////////////////////

    $('#wp-login-but-wd').on('click',function () {
 
        wpestate_login_wd();
    });

    $('#login_pwd_wd, #login_user_wd').keydown(function (e) {
       
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_login_wd();
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  TOPBAR  login  ajax
    ////////////////////////////////////////////////////////////////////////////////////////////

    $('#wp-login-but-topbar').on('click',function () {
       
        wpestate_login_topbar();
    });

    $('#login_pwd_topbar, #login_user_topbar').keydown(function (e) {
     
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_login_topbar();
        }
    });

    $('#wp-login-but-mobile').on('click',function () {
   
        wpestate_login_mobile();
    });

    $('#login_pwd_mobile, #login_user_mobile').keydown(function (e) {
      
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_login_mobile();
        }
    });
    

    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  Ajax update password
    //////////////////////////////////////////////////////////////////////////////////////////// 
    $('#oldpass, #newpass, #renewpass').keydown(function (e) {
      
        if (e.keyCode === 13) {
            e.preventDefault();
            wpestate_change_pass_profile();
        }
    });

    $('#change_pass').on('click',function () {

        wpestate_change_pass_profile();
    });
  
    ///////////////////////////////////////////////////////////////////////////////////////////  
    ////////  update profile
    ////////////////////////////////////////////////////////////////////////////////////////////   

    $('#update_profile').on('click',function () {
       
        var  userurl,usermobile, userinstagram,userpinterest, userlinkedin, usertwitter, userfacebook, profile_image_url, profile_image_url_small, firstname, secondname, useremail, userphone, userskype, usertitle, description, ajaxurl, securityprofile, upload_picture;
        firstname       =  $('#firstname').val();
        secondname      =  $('#secondname').val();
        useremail       =  $('#useremail').val();
        userphone       =  $('#userphone').val();
        usermobile      =  $('#usermobile').val();
        userskype       =  $('#userskype').val();
        usertitle       =  $('#usertitle').val();
        description     =  $('#about_me').val();
        userfacebook    =  $('#userfacebook').val();
        usertwitter     =  $('#usertwitter').val();
        userlinkedin    =  $('#userlinkedin').val();
        userpinterest   =  $('#userpinterest').val();
        userinstagram   =  $('#userinstagram').val();
        userurl         =  $('#website').val();
        
        ajaxurl         =  ajaxcalls_vars.admin_url + 'admin-ajax.php';
        securityprofile =  $('#security-profile').val();
        upload_picture  =  $('#upload_picture').val();
        profile_image_url  = $('#profile-image').attr('data-profileurl');
        profile_image_url_small  = $('#profile-image').attr('data-smallprofileurl');
       
        window.scrollTo(0,0);
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                'action'            :   'wpestate_ajax_update_profile',
                'firstname'         :   firstname,
                'secondname'        :   secondname,
                'useremail'         :   useremail,
                'userphone'         :   userphone,
                'usermobile'        :   usermobile,
                'userskype'         :   userskype,
                'usertitle'         :   usertitle,
                'description'       :   description,
                'upload_picture'    :   upload_picture,
                'security-profile'  :   securityprofile,
                'profile_image_url' :   profile_image_url,
                'profile_image_url_small':profile_image_url_small,
                'userfacebook'      :   userfacebook,
                'usertwitter'       :   usertwitter,
                'userlinkedin'      :   userlinkedin,
                'userpinterest'     :   userpinterest,
                'userinstagram'     :   userinstagram,
                'userurl'           :   userurl
            },
            success: function (data) {
                $('#profile_message').append('<div class="login-alert">' + data + '<div>');
                window.scrollTo(0,0);
            },
            error: function (errorThrown) {
            }
        });
    });

  

}); // end ready jquery
//End ready ********************************************************************