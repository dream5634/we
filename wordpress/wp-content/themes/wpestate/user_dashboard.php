<?php
// Template Name: User Dashboard
// Wp Estate Pack
if ( !is_user_logged_in() ) {   
    wp_redirect(  esc_url( home_url('/') ) );
    exit;
} 

$current_user = wp_get_current_user();
$userID                         =   $current_user->ID;
$user_login                     =   $current_user->user_login;
$user_pack                      =   get_the_author_meta( 'package_id' , $userID );
$user_registered                =   get_the_author_meta( 'user_registered' , $userID );
$user_package_activation        =   get_the_author_meta( 'package_activation' , $userID );   
$paid_submission_status         =   esc_html ( get_option('wp_estate_paid_submission','') );
$price_submission               =   floatval( get_option('wp_estate_price_submission','') );
$submission_curency_status      =   esc_html( get_option('wp_estate_submission_curency','') );
$edit_link                      =   wpestate_get_dasboard_add_listing();
$floor_link                     =   wpestate_get_dasboard_floor_plan();
$processor_link                 =   wpestate_get_procesor_link();


if( isset( $_GET['delete_id'] ) ) {
    if( !is_numeric($_GET['delete_id'] ) ){
          exit('you don\'t have the right to delete this');
    }else{
        $delete_id=$_GET['delete_id'];
        $the_post= get_post( $delete_id); 

        if( $current_user->ID != $the_post->post_author ) {
            exit('you don\'t have the right to delete this');;
        }else{
         
           
            // delete attchaments
            $arguments = array(
                'numberposts' => -1,
                'post_type' => 'attachment',
                'post_parent' => $delete_id,
                'post_status' => null,
                'exclude' => get_post_thumbnail_id(),
                'orderby' => 'menu_order',
                'order' => 'ASC'
            );
            $post_attachments = get_posts($arguments);
            
            foreach ($post_attachments as $attachment) {
               wp_delete_post($attachment->ID);                      
             }
           
            wp_delete_post( $delete_id ); 
          wp_redirect( wpestate_get_dashboard_link() );  exit;
        }  
        
    }
    
    
}  
  


get_header();
$wpestate_options=wpestate_page_details($post->ID);
?> 
  
<!--  -->
<?php
$current_user               =   wp_get_current_user();
$user_custom_picture        =   get_the_author_meta( 'small_custom_picture' , $current_user->ID  );
$user_small_picture_id      =   get_the_author_meta( 'small_custom_picture' , $current_user->ID  );
if( $user_small_picture_id == '' ){

    $user_small_picture[0]=get_template_directory_uri().'/img/default-user_1.png';
}else{
    $user_small_picture=wp_get_attachment_image_src($user_small_picture_id,'property_listings');
    
}
$add_link               =   wpestate_get_dasboard_add_listing();
$home_url               =   esc_url( home_url('/') );

?>
<!--  -->

<div class="row row_user_dashboard">

    
    <?php get_template_part('templates/user_dasboard_left');?> 
    
    <div class="col-md-9 dashboard-margin">
        <?php get_template_part('templates/breadcrumbs'); ?>   
        <?php get_template_part('templates/user_memebership_profile');  ?>
        <?php get_template_part('templates/ajax_container'); ?>
        
        <?php if (esc_html( get_post_meta($post->ID, 'page_show_title', true) ) != 'no') { ?>
            <h3 class="entry-title"><?php the_title(); ?></h3>
        <?php } ?>
        <?php
        $prop_no      =   intval( get_option('wp_estate_prop_no', '') );
        $paged        = (get_query_var('paged')) ? get_query_var('paged') : 1;
        $args = array(
                'post_type'        =>  'estate_property',
                'author'           =>  $current_user->ID,
                'paged'             => $paged,
                'posts_per_page'    => $prop_no,
                'post_status'      =>  array( 'any' )
                );


        $prop_selection = new WP_Query($args);
        if( !$prop_selection->have_posts() ){
            print'<div class="col-md-12 row_dasboard-prop-listing">';
            print '<h4 class="no_results_title">'.esc_html__('You don\'t have any properties yet!','wpestate').'</h4>';
            print'</div>';
        }else{
            print '
            <form action="'.get_dasboard_searches_link().'" id="search_dashboard_auto" method="POST">';
                wp_nonce_field( 'wpestate_search_list_nonce', 'wpestate_search_list_nonce_field' );
                print'<input type="text" id="prop_name" name="prop_name" value="" placeholder="'.esc_html__('Search a listing','wpestate').'">  
                <input type="submit" class="wpresidence_button" id="search_form_submit_1" value="'.esc_html__('Search','wpestate').'">
            </form> '; 
            
                
         }
         $autofill='';
           
        while ($prop_selection->have_posts()): $prop_selection->the_post();          
            get_template_part('templates/dashboard_listing_unit'); 
        endwhile;     
        
        
        $args2= array(
                'post_type'        =>  'estate_property',
                'author'           =>  $current_user->ID,
                'posts_per_page' => '-1' ,
                'post_status'      =>  array( 'any' ),
                'cache_results'             =>  false,
                'update_post_meta_cache'    =>  false,
                'update_post_term_cache'    =>  false,
        
                );
        $prop_selection2 = new WP_Query($args2);
        while ($prop_selection2->have_posts()): $prop_selection2->the_post();          
            $autofill.= '"'.get_the_title().'",';
        endwhile;     
        
        print '<script type="text/javascript">
           //<![CDATA[
                 jQuery(document).ready(function(){
                     var autofill=['.$autofill.']
                     jQuery( "#prop_name" ).autocomplete({
                     source: autofill
                 });
           });
           //]]>
           </script>';
        wpestate_pagination($prop_selection->max_num_pages, $range =2);
        ?>    
    </div>
</div>

<?php  
$ajax_nonce = wp_create_nonce( "wpestate_load_tab_stats_nonce" );
print'<input type="hidden" id="wpestate_load_tab_stats_nonce" value="'.esc_html($ajax_nonce).'" />    ';

$ajax_nonce_prop_actions = wp_create_nonce( "wpestate_property_actions_nonce" );
print'<input type="hidden" id="wpestate_property_actions_nonce" value="'.esc_html($ajax_nonce_prop_actions).'" />    ';

$ajax_nonce_pay= wp_create_nonce( "wpestate_payments_nonce" );
print'<input type="hidden" id="wpestate_payments_nonce" value="'.esc_html($ajax_nonce_pay).'" />    ';

get_footer(); 
?>