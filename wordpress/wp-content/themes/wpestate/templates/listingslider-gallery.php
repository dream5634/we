 <?php
global $post;
$arguments      = array(
    'numberposts'       => -1,
    'post_type'         => 'attachment',
    'post_mime_type'    => 'image',
    'post_parent'       => $post->ID,
    'post_status'       => null,
    'exclude'           => get_post_thumbnail_id(),
    'orderby'           => 'menu_order',
    'order'             => 'ASC'
);

$post_attachments   =   get_posts($arguments);
$count              =   0;
$total_pictures     =   count ($post_attachments);
     
if($count == 0 ){
    $full_prty          = wp_get_attachment_image_src(get_post_thumbnail_id(), 'listing_full_slider');
    print '<div class="col-md-8 image_gallery lightbox_trigger special_border" style="background-image:url('.esc_url($full_prty[0]).')  ">   <div class="img_listings_overlay" ></div></div>';
}


foreach ($post_attachments as $attachment) {
    $count++;
    $special_border='  ';
    if($count==1){
        $special_border=' special_border ';
    }
    
    if($count==2){
        $special_border=' special_border_top ';
    }
    
    if($count==4){
        $special_border=' special_border_left ';
    }
    
    if($count <= 4 ){
        $full_prty          = wp_get_attachment_image_src($attachment->ID, 'listing_full_slider');
        print '<div class="col-md-4 image_gallery lightbox_trigger '.esc_attr($special_border).' " style="background-image:url('.esc_url($full_prty[0]).')"> <div class="img_listings_overlay" ></div> </div>';
    }


    if($count ==5 ){
        $full_prty          = wp_get_attachment_image_src($attachment->ID, 'listing_full_slider');
        print '<div class="col-md-4 image_gallery last_gallery_item lightbox_trigger" style="background-image:url('.esc_url($full_prty[0]).')  ">
            <div class="img_listings_overlay img_listings_overlay_last" ></div>
            <span class="img_listings_mes">'.esc_html__( 'See all','wpestate').' '. esc_html($total_pictures) .' '.esc_html__( 'photos','wpestate').'</span></div>';
    }

}

?>