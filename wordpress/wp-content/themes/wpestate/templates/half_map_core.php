<?php

global $prop_selection ;
global $post;
global $is_col_md_12;
global $num;
global $args;
global $custom_advanced_search;
global $adv_search_what;
global $adv_search_how;
global $adv_search_label;
global $wpestate_prop_unit_class;
global $wpestate_property_unit_slider;
global $wpestate_no_listins_per_row;
global $wpestate_uset_unit;
global $wpestate_custom_unit_structure;
global $wpestate_included_ids;
        
$wpestate_custom_unit_structure      =   get_option('wpestate_property_unit_structure');
$wpestate_uset_unit         =   intval ( get_option('wpestate_uset_unit','') );        
$wpestate_no_listins_per_row=   intval( get_option('wp_estate_listings_per_row', '') );
$args2                      =   wpestate_get_select_arguments();
$action_select_list         =   wpestate_get_action_select_list($args2);
$categ_select_list          =   wpestate_get_category_select_list($args2);
$select_city_list           =   wpestate_get_city_select_list($args2); 
$select_area_list           =   wpestate_get_area_select_list($args2);
$select_county_state_list   =   wpestate_get_county_state_select_list($args2);
$wpestate_property_unit_slider       =   get_option('wp_estate_prop_list_slider','');
$top_bar_style              =   "";    


if(esc_html ( get_option('wp_estate_show_top_bar_user_menu','') )=="no"){
    $top_bar_style              =   ' half_no_top_bar ';          
}

$logo_header_type    =   get_option('wp_estate_logo_header_type','');
get_template_part('templates/property_ajax_tax_hidden_filters'); 

$property_card_type         =   intval(get_option('wp_estate_unit_card_type'));
$property_card_type_string  =   '';
if($property_card_type==0){
    $property_card_type_string='';
}else{
    $property_card_type_string='_type'.$property_card_type;
}
?>

<div class="row">
     
    <div class="half_map_search_wrapper">
        <?php
        $show_adv_search_general    =   get_option('wp_estate_show_adv_search_general','');
        if($show_adv_search_general ==  'yes' ){
            $show_mobile=1;
            print '<div class="search_wrapper" id="xsearch_wrapper" >  ';
                include(get_theme_file_path('templates/advanced_search_type_half.php'));
            print '</div>';
        }
        ?>
    </div>
    
    <div id="google_map_prop_list_sidebar" class="<?php echo esc_html( $top_bar_style.' half_'.$logo_header_type) ;?>">
        <?php 
        
        $wpestate_show_compare_only  =   'yes';
        
        if( is_page_template('advanced_search_results.php') ) {
            
            while (have_posts()) : the_post();
                if (esc_html( get_post_meta($post->ID, 'page_show_title', true) ) == 'yes') { ?>
                    <h1 class="entry-title title_prop"><?php the_title(); print " (".esc_html($num).")" ?></h1>   
                    
                <?php } ?>
                <div class="single-content">
            
                <?php 
                $show_save_search            =   get_option('wp_estate_show_save_search','');
   
                if ($show_save_search=='yes' ){
                    if( is_user_logged_in() ){
                        print '<div class="search_unit_wrapper advanced_search_notice">';
                        print '<div class="search_param"><strong>'.esc_html__('Search Parameters: ','wpestate').'</strong>';
                            wpestate_show_search_params_new($wpestate_included_ids,$args,$custom_advanced_search, $adv_search_what,$adv_search_how,$adv_search_label);
                        print'</div>';
                        print'</div>';


                        print '<div class="saved_search_wrapper"> <span id="save_search_notice">'.esc_html__('Save this Search?','wpestate').'</span>'; 
                        print '<input type="text" id="search_name" class="new_search_name" placeholder="'.esc_html__('Search name','wpestate').'">';
                        print '<button class="wpresidence_button" id="save_search_button">'.esc_html__('Save Search','wpestate').'</button>';
                        $ajax_nonce = wp_create_nonce( "wpestate_save_search_nonce" );
                        print'<input type="hidden" id="wpestate_save_search_nonce" value="'.esc_html($ajax_nonce).'" />    ';
                        print  "<input type='hidden' id='search_args' value=' ";
                        print json_encode($args,JSON_HEX_TAG);
                        print "'>";
                        print  "<input type='hidden' id='meta_args' value=' ";
                        print json_encode($wpestate_included_ids,JSON_HEX_TAG);
                        print "'>";
                        
                        print '<input type="hidden" name="save_search_nonce" id="save_search_nonce"  value="'. wp_create_nonce( 'save_search_nonce' ).'" />';
                        print '';
                        print '</div>';
                    }else{
                        print '<div class="vc_row wpb_row vc_row-fluid vc_row">
                                <div class="vc_col-sm-12 wpb_column vc_column_container vc_column">
                                    <div class="wpb_wrapper">
                                        <div class="wpb_alert wpb_content_element vc_alert_rounded wpb_alert-info wpestate_message vc_message">
                                            <div class="messagebox_text"><p>'.esc_html__('Login to save search and and you will receive an email notification when new properties matching your search will be published.','wpestate').'</p>
                                        </div>
                                        </div>
                                    </div> 
                                </div> 
                        </div>';

                    }

                }

            
            ?>
        
            </div>
                            
        <?php endwhile; // end of the loop.  
        
        }else if( is_tax()) { ?>
           
            <h1 class="entry-title title_prop"> 
                <?php 
                    esc_html_e('Properties listed in ','wpestate');
                    //print '"';
                    single_cat_title();
                    //print '" ';
                ?>
            </h1>
        
        
        <?php
        }else{
            while (have_posts()) : the_post(); ?>
                <?php 
                if (esc_html( get_post_meta($post->ID, 'page_show_title', true) ) == 'yes') { ?>
                    <h1 class="entry-title title_prop"><?php the_title(); ?></h1>
                <?php } 
                ?>
               
            <?php 
            endwhile; // end of the loop.  
        }
        ?>  

       
              
              
     
        <?php  get_template_part('templates/spiner'); ?> 
        <div id="listing_ajax_container" class="ajax-map"> 
            
                  

           <?php
            $counter = 0;

            $is_col_md_12=1;    
            if ( $prop_selection->have_posts() ) {
                while ($prop_selection->have_posts()): $prop_selection->the_post(); 
                    get_template_part('templates/property_unit'.$property_card_type_string);
                endwhile;                
            }else{
                print '<h4 class="no_results_title">'.esc_html__('You don\'t have any properties yet!','wpestate').'</h4>';
            }

            wp_reset_query();               
        ?>
        </div>
        <!-- Listings Ends  here --> 
        
        
        <div class="half-pagination">
        <?php wpestate_pagination($prop_selection->max_num_pages, $range =2); ?>       
        </div>    
    </div><!-- end 8col container-->
    
     <div  id="google_map_prop_list_wrapper" class="google_map_prop_list <?php echo esc_html( $top_bar_style.' half_'.$logo_header_type); ?>"  >
        <?php get_template_part('templates/google_maps_base'); ?>
    </div> 

</div>  