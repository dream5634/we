<?php
// Sigle - Blog post
// Wp Estate Pack
global $post;
get_header(); 
$wpestate_options=wpestate_page_details($post->ID); 

?>



<div class="row">
    <?php get_template_part('templates/breadcrumbs'); ?>
    <div class="col-xs-12 <?php print esc_html($wpestate_options['content_class']);?> ">
        
         <?php get_template_part('templates/ajax_container'); ?>
        
        <?php while (have_posts()) : the_post(); ?>
            <?php if (esc_html( get_post_meta($post->ID, 'page_show_title', true) ) != 'no') { ?>
                <h1 class="entry-title"><?php the_title(); ?></h1>
            <?php } ?>
         
            <div class="single-content single_width_page"><?php the_content();?></div><!-- single content-->

                   
        
        <!-- #comments start-->
        <?php 
        if(!is_front_page()){
            if ( get_comments_number(get_the_ID() ) !==0 ) :
                comments_template('', true);
            endif;
        }
        ?> 	
        <!-- end comments -->   
        
        <?php endwhile; // end of the loop. ?>
    </div>
  
    
<?php  include(get_theme_file_path('sidebar.php'));  ?>
</div>   
<?php get_footer(); ?>