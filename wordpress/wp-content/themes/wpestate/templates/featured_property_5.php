<?php
global $wpestate_property_unit_slider;
global $sale_line;
     
$prop_id        =   $post->ID;
$return_string  =   '';    
$thumb_id       =   get_post_thumbnail_id($prop_id);
$preview        =   wp_get_attachment_image_src(get_post_thumbnail_id(), 'property_listings');
if($preview[0]==''){
    $preview[0]= get_template_directory_uri().'/img/defaults/default_property_featured.jpg';
}
$link           =   esc_url ( get_permalink());
$title          =   get_the_title();
$price          =   floatval( get_post_meta($prop_id, 'property_price', true) );
$price_label    =   '<span class="price_label">'.esc_html ( get_post_meta($prop_id, 'property_label', true) ).'</span>';
$price_label_before    =   '<span class="price_label price_label_before">'.esc_html ( get_post_meta($prop_id, 'property_label_before', true) ).'</span>';
$wpestate_currency       =   esc_html( get_option('wp_estate_currency_symbol', '') );
$wpestate_where_currency =   esc_html( get_option('wp_estate_where_currency_symbol', '') );
$content        =   wpestate_strip_words( get_the_excerpt(),30).' ...';
$gmap_lat       =   esc_html( get_post_meta($prop_id, 'property_latitude', true));
$gmap_long      =   esc_html( get_post_meta($prop_id, 'property_longitude', true));
$prop_stat      =   stripslashes ( esc_html( get_post_meta($prop_id, 'property_status', true) ) );

if (function_exists('icl_translate') ){
    $prop_stat     =   icl_translate('wpestate','wp_estate_property_status_sh_'.$prop_stat, $prop_stat ) ;                                      
}

$featured           =   intval  ( get_post_meta($prop_id, 'prop_featured', true) );
$agent_face         =   wp_get_attachment_image_src($thumb_id, 'agent_picture_thumb');
$property_bathrooms =   get_post_meta($post->ID, 'property_bathrooms', true);
$property_rooms     =   get_post_meta($post->ID, 'property_bedrooms', true);
$property_size      =   get_post_meta($post->ID, 'property_size', true) ;
$measure_sys        =   esc_html(get_option('wp_estate_measure_sys', ''));
$garage_no          =   get_post_meta($post->ID, 'property-garage', true) ;
$property_city      =   get_the_term_list($post->ID, 'property_city', '', ', ', '') ;
$property_area      =   get_the_term_list($post->ID, 'property_area', '', ', ', '');

if ($price != 0) {
    $price = wpestate_show_price($prop_id,$wpestate_currency,$wpestate_where_currency,1);  
}else{
    $price=$price_label_before.$price_label;
}

$current_user = wp_get_current_user();
$userID                     =   $current_user->ID;
$user_option                =   'favorites'.$userID;
?>

<div class="featured_property featured_property_type5">
    
    <div class="featured_secondline" data-link="<?php echo esc_url($link);?>">
        <h2>
            <a href="<?php esc_url($link);?>">
            <?php 
            echo mb_substr( $title,0,27); 
            if( mb_strlen($title)>27 ){
                echo  '...';   
            }
            ?>
            </a>
        </h2>

            
        <div class="featured_prop_price">
            <?php echo wp_kses_post($price); ?>
        </div>
        
        <div class="property_featured_wrapper">

            <?php
            if($property_city!=''){
                echo '<div class="featured5_details_wrapper">'
                    . '<div class="featured5_detail_label">' . esc_html__('City', 'wpestate') . '</div>'
                    . '<div class="featured5_detail">'.wp_kses_post($property_city).'</div>'
                . '</div>';
            }

            if($property_area!=''){
                echo '<div class="featured5_details_wrapper">'
                    . '<div class="featured5_detail_label">' . esc_html__('Area', 'wpestate') . '</div>'
                    . '<div class="featured5_detail">'.wp_kses_post($property_area).'</div>'
                . '</div>';
            }

            if($property_rooms!=''){
                echo '<div class="featured5_details_wrapper">'
                    . '<div class="featured5_detail_label">' . esc_html__('Rooms', 'wpestate') . '</div>'
                    . '<div class="featured5_detail">'.esc_html($property_rooms).'</div>'
                . '</div>';
            }

            if($property_bathrooms!=''){
                echo '<div class="featured5_details_wrapper">'
                    . '<div class="featured5_detail_label">' . esc_html__('Bathrooms', 'wpestate') . '</div>'
                    . '<div class="featured5_detail">'.esc_html($property_bathrooms).' </div>'
                . '</div>';
            }

            if($property_size!=''){
                echo '<div class="featured5_details_wrapper">'
                    . '<div class="featured5_detail_label">' . esc_html__('Size', 'wpestate') . '</div>'
                    . '<div class="featured5_detail"> '.esc_html($property_size).' '.esc_html($measure_sys).'<sup>2</sup></div>'
                . '</div>';
            }    
            ?>

        </div>
 
                
    </div> 
          


    <div class="featured_img" data-link="<?php echo esc_url($link);?>" >
        <div class="tag-wrapper">
            <?php 
            if($featured==1){
                echo '<div class="featured_div">'.esc_html__('Featured','wpestate').'</div>';
            }
            
            if ($prop_stat != 'normal') {
                $ribbon_class = str_replace(' ', '-', $prop_stat);
                if (function_exists('icl_translate') ){
                    $prop_stat     =   icl_translate('wpestate','wp_estate_property_status'.$prop_stat, $prop_stat );
                }
                echo '<div class="ribbon-wrapper-default ribbon-wrapper-' . esc_attr($ribbon_class). '"><div class="ribbon-inside ' . esc_attr($ribbon_class) . '">' . esc_html($prop_stat) . '</div></div>';
            } 
            ?> 
        </div>
            
        <?php 
        if(  $wpestate_property_unit_slider==1){

            $arguments      = array(
                'numberposts'       =>  -1,
                'post_type'         =>  'attachment',
                'post_mime_type'    =>  'image',
                'post_parent'       =>  $prop_id,
                'post_status'       =>  null,
                'exclude'           =>  get_post_thumbnail_id($prop_id),
                'orderby'           =>  'menu_order',
                'order'             =>  'ASC'
            );
            $post_attachments   = get_posts($arguments);

            $slides='';
            $no_slides = 0;
            
            foreach ($post_attachments as $attachment) { 
                $no_slides++;
                $preview_att    =   wp_get_attachment_image_src($attachment->ID, 'property_listings');
                if($preview_att[0]==''){
                    $preview_att[0]= get_template_directory_uri().'/img/defaults/default_property_featured.jpg';
                }

                $slides     .= '<div class="item" style="background-image:url('.esc_url($preview_att[0]).');"></div>';

            }// end foreach
            ?>
        
        
        
        
        
            <div id="property_unit_featured_carousel_<?php echo intval($prop_id);?>"  class="carousel slide  " data-ride="carousel" data-interval="false" >
                <div class="carousel-inner">         
                    <div class="item active" style="background-image:url(' <?php echo esc_url($preview[0]);?> ');">
                        <a href="<?php echo esc_url($link);?>"></a>
                    </div>
                    <?php echo trim($slides);?>
                </div>
                
                    <?php 
                        if( $no_slides >= 1){
                            echo '<a class="left  carousel-control" href="#property_unit_featured_carousel_'.intval($prop_id).'" data-slide="next">
                                <i class="demo-icon icon-left-open-big"></i>
                            </a>

                            <a class="right  carousel-control" href="#property_unit_featured_carousel_'.intval($prop_id).'" data-slide="prev">
                                <i class="demo-icon icon-right-open-big"></i>
                            </a>';
                        }
                        
                    ?>
                
            </div>
        <?php
        }else{?>
            <div id="property_unit_featured_carousel_<?php echo intval($prop_id);?>"  class="carousel slide" >
                <?php
                echo '<div class="item" style="background-image:url('.esc_url($preview[0]).');"></div>';
                ?>
            </div>
            <?php    
            }
            ?>
          
                
    </div>
    

         

</div>