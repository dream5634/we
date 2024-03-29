<?php
// Template Name: Zillow Estimate
// Wp Estate Pack
get_header();
$wpestate_options=wpestate_page_details($post->ID);
$message                =   '';
$hasError               =   false;
$receiver_email         =   is_email ( get_bloginfo('admin_email') );
$sell_estimate_city     =   '';
$sell_estimate_state    =   '';
$sell_estimate_adr      =   '';
 $allowed_html          =   array();

if( isset( $_POST['zill_estimate_state'] )  ){
    if ( trim($_POST['zill_estimate_state']) == '') {
        $hasError = true;
        $error[] = esc_html__('The state field is empty !','wpestate');
    } else {
        $sell_estimate_state = esc_html(wp_kses( trim($_POST['zill_estimate_state']),$allowed_html ));
    } 
}


if( isset( $_POST['zill_estimate_city'] )  ){
    if (trim($_POST['zill_estimate_city']) == '') {
        $hasError = true;
        $error[] = esc_html__('The City field is empty !','wpestate');
    } else {
        $sell_estimate_city = esc_html(wp_kses( trim($_POST['zill_estimate_city']),$allowed_html ));
    }
}

if( isset( $_POST['zill_estimate_adr'] )  ){
    if (trim($_POST['zill_estimate_adr']) == '') {
        $hasError = true;
        $error[] = esc_html__('Your address field is empty!','wpestate');
    } else {
        $sell_estimate_adr =esc_html( wp_kses( trim ($_POST['zill_estimate_adr'] ),$allowed_html ));
    }     
}



$estimates=array();

if (!$hasError) {
   $estimates = wpestate_call_zillow($sell_estimate_adr,$sell_estimate_city,$sell_estimate_state);
}
else {
    $hasError = true;
}
    
$to_print='';
if ($hasError) {
    foreach ($error as $mes) {
        $to_print.=$mes . '<br />';
    }
}
?>

<div class="row">
    <?php get_template_part('templates/breadcrumbs'); ?>
    <div class="<?php print esc_html($wpestate_options['content_class']);?> ">
        
         <?php get_template_part('templates/ajax_container'); ?>
        
            <?php  while (have_posts()) : the_post(); 
                    if ( esc_html (get_post_meta($post->ID, 'page_show_title', true) ) != 'no') { ?>
                        <h1 class="entry-title"><?php the_title(); ?></h1>
                     <?php } ?> 
               
                    <?php
                    print esc_html( $to_print );
                    if (!$hasError){
                        if($estimates['suma']!=0){
                         print '<div class="estimate-result single-content">
                             <img src="'.get_template_directory_uri().'/img/zillow-logo.png" alt="'.esc_attr__('logo','wpestate').'" class="zillowlogo"/>
                             <h3> On '.esc_html($estimates['data']).' this property is estimated at <span class="zillow-price"> $ '.number_format( intval ( $estimates['suma'] )  ).'</span> </h3>
                                <div class="zillow-price"></div> 
                                <div class="zillow-details">
                                    Address: '.esc_html($sell_estimate_adr).' </br>
                                    City: '.esc_html($sell_estimate_city).'</br>
                                    State: '.esc_html($sell_estimate_state).'</br>
                                </div>
                             </div>';
                        }else{
                          print '<div class="estimate-result">'.esc_html__('We are sorry, but we don\'t have an estimation for this property at this moment!  ','wpestate').'</div>';
                        }
                        the_content();
                    }else{
                        esc_html_e('Please fill in the form correctly and try again!','wpestate');
                    }
                    
            endwhile; 
        ?>
    </div>
  
    
<?php  include(get_theme_file_path('sidebar.php'));  ?>
</div>   
<?php get_footer(); ?>